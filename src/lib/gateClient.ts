/**
 * Central enquiry gate client (v1.0.0, 17 Nov 2026). Sites copy this file
 * verbatim, like solicitation.ts. Canonical copy:
 * C:\dev\projects\_HOME\shared-code\solicitation\gateClient.ts
 * How to wire a site: GATE.md beside it.
 *
 * Before a site delivers any enquiry it asks the Boostkit platform's gate
 * (`POST https://crm.boostkit.io/leads/gate/<site id>`) whether to deliver it,
 * hold it for Matt, or treat it as Matt's own test. The platform runs the one
 * copy of the filter (rules, bot-shape checks and Jev), stores the decision and
 * lists a hold on the Held enquiries page with the site's release link.
 *
 * If the gate cannot answer within 3 seconds (or is not configured, or answers
 * anything but a decision), the site's own copy of the filter decides (the
 * `local` function the site passes in: its `screenEnquiry` or
 * `checkSolicitation`), and the fallback is reported to the gate afterwards so
 * the daily audit sees it. If that also fails, the submission is delivered:
 * this never drops a submission.
 *
 * Self-contained: no imports, Web Crypto only, so it runs in Next.js route
 * handlers, the Edge runtime, Convex actions and `node --test`.
 */

export const GATE_CLIENT_VERSION = "1.0.0";

/** The site's wait for the gate before it decides on its own. */
export const GATE_TIMEOUT_MS = 3000;
/** The fallback report's own wait; it never holds up the visitor for long. */
export const REPORT_TIMEOUT_MS = 1500;

export type GateAction = "deliver" | "hold" | "owner-test";

export type GateSubmission = {
    /** The site's own id for this submission (a UUID). A retry with the same id gets the first answer. */
    id: string;
    /** The form, e.g. "contact" or "booking". */
    form: string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    subject?: string | null;
    /** What the person wrote. */
    message?: string | null;
    /** Other written answers (a booking's vehicle and description). Never consent ticks or page addresses. */
    fields?: Record<string, string | number | null | undefined>;
    /** The site's own signed release link for this submission, so Matt can release a hold with one click. */
    releaseUrl?: string | null;
    /** How the Held page names the site, e.g. "Signature Auto Repairs". */
    siteName?: string | null;
};

export type LocalVerdict = { blocked: boolean; reasons: string[] };

export type GateOutcome = {
    action: GateAction;
    /** The gate's id for the decision (the Held page item for a hold), or null when the site decided on its own. */
    id: string | null;
    reasons: string[];
    /** "gate" when the platform decided; "local" when the site's own filter did. */
    source: "gate" | "local";
    /** Why the gate was not used, when source is "local". */
    error?: string;
};

export type GateOptions = {
    submission: GateSubmission;
    /** The site's own filter, used only when the gate cannot answer. */
    local: () => LocalVerdict | Promise<LocalVerdict>;
    /** Defaults to process.env. Reads HELD_ENQUIRIES_URL, HELD_ENQUIRIES_SECRET, ENQUIRY_GATE_URL, ENQUIRY_GATE. */
    env?: Record<string, string | undefined>;
    fetchImpl?: typeof fetch;
    timeoutMs?: number;
    now?: () => number;
    log?: (line: string) => void;
};

/** Mail from these domains is Boostkit testing a site: Matt only, never the client. */
export const OWNER_TEST_DOMAINS = ["boostkit.io"] as const;

/** True for any address at exactly boostkit.io (any case); never a look-alike. */
export function isOwnerTest(email: string | null | undefined): boolean {
    const value = (email ?? "").trim().toLowerCase();
    const at = value.lastIndexOf("@");
    if (at <= 0) return false;
    const domain = value.slice(at + 1).replace(/\.+$/, "");
    return (OWNER_TEST_DOMAINS as readonly string[]).includes(domain);
}

/**
 * The gate's address for this site: ENQUIRY_GATE_URL if set, else the site's
 * HELD_ENQUIRIES_URL with `/leads/held/` turned into `/leads/gate/`, so a site
 * already posting to the Held enquiries page needs no new variable.
 */
export function gateUrl(env: Record<string, string | undefined>): string | null {
    const explicit = (env.ENQUIRY_GATE_URL ?? "").trim();
    if (explicit) return explicit;
    const held = (env.HELD_ENQUIRIES_URL ?? "").trim();
    if (!held.includes("/leads/held/")) return null;
    return held.replace("/leads/held/", "/leads/gate/");
}

async function hmacHex(secret: string, text: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(text));
    return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/** Headers for a signed post: purpose "gate" for a question, "gatereport" for a fallback report. */
export async function signedHeaders(purpose: "gate" | "gatereport", secret: string, body: string, nowMs: number): Promise<Record<string, string>> {
    const timestamp = String(Math.floor(nowMs / 1000));
    const signature = await hmacHex(secret, `${purpose}.${timestamp}.${body}`);
    return { "Content-Type": "application/json", "X-Boostkit-Timestamp": timestamp, "X-Boostkit-Signature": `sha256=${signature}` };
}

function bodyOf(submission: GateSubmission): string {
    const fields: Record<string, string> = {};
    for (const [name, value] of Object.entries(submission.fields ?? {})) {
        if (value !== null && value !== undefined && String(value).trim()) fields[name] = String(value);
    }
    return JSON.stringify({
        id: submission.id,
        form: submission.form,
        name: submission.name ?? "",
        email: submission.email ?? "",
        phone: submission.phone ?? "",
        subject: submission.subject ?? "",
        message: submission.message ?? "",
        fields,
        releaseUrl: submission.releaseUrl ?? undefined,
        siteName: submission.siteName ?? undefined,
    });
}

type PendingReport = { id: string; form: string; decided: GateAction; error: string; at: number; reasons: string[] };

// Fallbacks not yet reported (per server instance). Sent with the next report.
const pending: PendingReport[] = [];

/** For tests only. */
export function pendingReports(): readonly PendingReport[] {
    return pending;
}

/** For tests only. */
export function resetGateClient(): void {
    pending.length = 0;
}

async function sendReport(url: string, secret: string, fetchImpl: typeof fetch, now: number): Promise<void> {
    if (pending.length === 0) return;
    const batch = pending.slice(0, 20);
    const body = JSON.stringify({ fallbacks: batch });
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REPORT_TIMEOUT_MS);
    try {
        const response = await fetchImpl(`${url.replace(/\/+$/, "")}/report`, {
            method: "POST",
            headers: await signedHeaders("gatereport", secret, body, now),
            body,
            signal: controller.signal,
        });
        if (response.ok) pending.splice(0, batch.length);
    } catch {
        // Kept for the next call.
    } finally {
        clearTimeout(timer);
    }
}

async function decideLocally(options: GateOptions, error: string, log: (line: string) => void): Promise<GateOutcome> {
    const { submission } = options;
    if (isOwnerTest(submission.email)) return { action: "owner-test", id: null, reasons: ["owner-test:boostkit.io"], source: "local", error };
    try {
        const verdict = await options.local();
        return { action: verdict.blocked ? "hold" : "deliver", id: null, reasons: verdict.reasons, source: "local", error };
    } catch (caught) {
        // The site's own filter failed too: deliver rather than lose an enquiry.
        log(`[enquiry-gate] local filter failed: ${caught instanceof Error ? caught.name : "error"}`);
        return { action: "deliver", id: null, reasons: ["local-filter-failed"], source: "local", error };
    }
}

/**
 * Ask the gate what to do with a submission. Never throws.
 *
 * - "deliver": deliver as normal.
 * - "hold": do not deliver. If source is "gate", the gate has already listed it
 *   on the Held enquiries page: send nothing else. If source is "local", run the
 *   site's own held path (held notice to Matt and the Held page post).
 * - "owner-test": send it to Matt only (the site's held channel, marked "Test"),
 *   never to the client.
 *
 * In every case the visitor gets the same success answer.
 */
export async function gateEnquiry(options: GateOptions): Promise<GateOutcome> {
    const env = options.env ?? (typeof process !== "undefined" ? process.env : {});
    const now = options.now ?? Date.now;
    const log = options.log ?? ((line: string) => console.info(line));
    const fetchImpl = options.fetchImpl ?? fetch;
    const url = gateUrl(env);
    const secret = (env.HELD_ENQUIRIES_SECRET ?? "").trim();
    const off = (env.ENQUIRY_GATE ?? "").trim().toLowerCase() === "off";
    if (off || !url || !secret) {
        const outcome = await decideLocally(options, off ? "off" : "not-configured", log);
        log(`[enquiry-gate] ${JSON.stringify({ v: GATE_CLIENT_VERSION, form: options.submission.form, source: "local", error: outcome.error, action: outcome.action })}`);
        return outcome;
    }

    const body = bodyOf(options.submission);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? GATE_TIMEOUT_MS);
    let error = "unknown";
    try {
        const response = await fetchImpl(url, { method: "POST", headers: await signedHeaders("gate", secret, body, now()), body, signal: controller.signal });
        if (response.ok) {
            const answer = (await response.json()) as { action?: unknown; id?: unknown; reasons?: unknown };
            if (answer.action === "deliver" || answer.action === "hold" || answer.action === "owner-test") {
                const outcome: GateOutcome = {
                    action: answer.action,
                    id: typeof answer.id === "string" ? answer.id : null,
                    reasons: Array.isArray(answer.reasons) ? answer.reasons.filter((reason): reason is string => typeof reason === "string") : [],
                    source: "gate",
                };
                clearTimeout(timer);
                // A working gate: send any fallbacks still waiting to be reported.
                if (pending.length) await sendReport(url, secret, fetchImpl, now());
                log(`[enquiry-gate] ${JSON.stringify({ v: GATE_CLIENT_VERSION, form: options.submission.form, source: "gate", action: outcome.action })}`);
                return outcome;
            }
            error = "bad-answer";
        } else {
            error = `http-${response.status}`;
        }
    } catch (caught) {
        error = controller.signal.aborted || (caught instanceof Error && caught.name === "AbortError") ? "timeout" : "network";
    } finally {
        clearTimeout(timer);
    }

    const outcome = await decideLocally(options, error, log);
    pending.push({ id: options.submission.id, form: options.submission.form, decided: outcome.action, error, at: now(), reasons: outcome.reasons.slice(0, 20) });
    if (pending.length > 100) pending.splice(0, pending.length - 100);
    // A gate that refused (4xx) or failed (5xx) may still take a report; a timeout or network failure usually will not,
    // so that one waits for the next call.
    if (error.startsWith("http-") || error === "bad-answer") await sendReport(url, secret, fetchImpl, now());
    log(`[enquiry-gate] ${JSON.stringify({ v: GATE_CLIENT_VERSION, form: options.submission.form, source: "local", error, action: outcome.action })}`);
    return outcome;
}
