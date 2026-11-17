// The contact form's server side: validation, the central enquiry gate, the
// held path and the release link. Kept free of Next.js imports (relative
// imports with .ts extensions) so `node --test` can run it directly.
// See docs/enquiry-filtering.md.
//
// Every enquiry asks the central enquiry gate on the Boostkit platform first
// (gateClient.ts, copied verbatim from _HOME/shared-code/solicitation):
// - deliver: emailed to the studio (CONTACT_TO_EMAIL) by Resend, as before;
// - hold: the gate has already listed it on the Held enquiries page
//   (crm.boostkit.io/agency/held); nothing else is sent;
// - owner-test (any @boostkit.io sender): emailed to Matt only, marked Test,
//   never to the studio.
// When the gate cannot answer within 3 seconds the local filter decides
// (rules only). A local hold is posted to the Held enquiries page and emailed
// to Matt with a signed release link; only if both fail is it delivered.

import { z } from "zod";
// @ts-expect-error: node --test needs the .ts extension (tsc does not allow it here)
import { gateEnquiry } from "./gateClient.ts";
// @ts-expect-error: node --test needs the .ts extension (tsc does not allow it here)
import { isOwnerTest, screenEnquiry, SOLICITATION_FILTER_VERSION } from "./solicitation.ts";

export const SITE_ORIGIN = "https://klaxon.studio";
export const RELEASE_PATH = "/api/contact/release";
/** Held notices and owner tests go here and nowhere else. */
export const MATT = "matt@boostkit.io";
const RELEASE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Klaxon's real briefs talk about websites, Meta and Google ads, so hold words are off (the softer filter). */
export const KLAXON_SITE = {
  id: "klaxon-studio",
  description: "Klaxon Studio, a video production company in Bermondsey, London, making commercials and branded content",
  holdWords: false,
};
export const KLAXON_BUSINESS = { names: ["Klaxon Studio", "Klaxon"], domains: ["klaxon.studio"] };

export const ContactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  company: z.string().max(200).optional().or(z.literal("")),
  brief: z.string().min(10).max(5000),
  // Honeypot: should always be empty for real users.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type Enquiry = { name: string; email: string; company: string; brief: string };

function sanitiseHeader(s: string) {
  return s.replace(/[\r\n]/g, "");
}

function env(name: string): string {
  return (process.env[name] ?? "").trim();
}

function json(body: object, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}

/* ------------------------------------------------------------------ email */

async function sendEmail(message: { to: string; subject: string; text: string; replyTo?: string }): Promise<void> {
  const apiKey = env("RESEND_API_KEY");
  const from = env("RESEND_FROM_EMAIL");
  if (!apiKey || !from) throw new Error("Resend is not configured");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: message.to, subject: message.subject, text: message.text, reply_to: message.replyTo }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Resend returned ${response.status}`);
}

function enquiryText(e: Enquiry): string {
  return `Name: ${e.name}\nEmail: ${e.email}\n` + (e.company ? `Company: ${e.company}\n` : "") + `\n${e.brief}`;
}

/** The studio's email, exactly as before the gate. Throws on failure. */
export async function deliverEnquiry(e: Enquiry): Promise<void> {
  const to = env("CONTACT_TO_EMAIL");
  if (!to) throw new Error("CONTACT_TO_EMAIL is not set");
  if (isOwnerTest(e.email)) throw new Error("An owner test is never delivered to the studio");
  await sendEmail({
    to,
    replyTo: e.email,
    subject: `New enquiry from ${sanitiseHeader(e.name)}${e.company ? ` (${sanitiseHeader(e.company)})` : ""}`,
    text: `${enquiryText(e)}\n\n--\nSent from the klaxon.studio contact form`,
  });
}

/** A notice to Matt only: an owner test, or a local hold with its release link. */
export async function sendMattNotice(e: Enquiry, args: { test: boolean; reasons: string[]; releaseUrl: string | null }): Promise<void> {
  const subject = args.test
    ? `[Klaxon] Test, not sent to the client: ${sanitiseHeader(e.name)}`
    : `[Klaxon] Held, not sent to the client: ${sanitiseHeader(e.name)}`;
  const intro = args.test
    ? "Test from a boostkit.io address. Not sent to Klaxon Studio and never will be."
    : `Held as a likely sales pitch or automated junk. Not sent to Klaxon Studio.\nHeld because: ${args.reasons.join("; ")}\n\n` +
      (args.releaseUrl
        ? `Release to Klaxon: ${args.releaseUrl}\nOpen it, check the details, then press "Release to Klaxon Studio". The link works for 30 days.`
        : "No release link (SOLICITATION_RELEASE_SECRET is not set). If this is a real enquiry, forward it to the studio by hand.");
  await sendEmail({ to: MATT, subject, text: `${intro}\n\n${enquiryText(e)}\n\n--\nklaxon.studio contact form` });
}

/* --------------------------------------------------------- release links */

function b64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(text: string): Uint8Array {
  const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmac(secret: string, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(text))));
}

export function releaseSecret(): string | null {
  const secret = env("SOLICITATION_RELEASE_SECRET");
  return secret.length >= 16 ? secret : null;
}

export async function signReleaseToken(e: Enquiry, secret: string, now = Date.now()): Promise<string> {
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ v: 1, site: "klaxon", exp: now + RELEASE_TTL_MS, e })));
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function verifyReleaseToken(
  token: string,
  secret: string,
  now = Date.now()
): Promise<{ status: "valid" | "expired"; enquiry: Enquiry } | { status: "invalid" }> {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return { status: "invalid" };
  if ((await hmac(secret, payload)) !== signature) return { status: "invalid" };
  try {
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as { site?: string; exp?: number; e?: Enquiry };
    if (data.site !== "klaxon" || typeof data.exp !== "number" || !data.e) return { status: "invalid" };
    return { status: data.exp <= now ? "expired" : "valid", enquiry: data.e };
  } catch {
    return { status: "invalid" };
  }
}

async function releaseUrlFor(e: Enquiry): Promise<string | null> {
  const secret = releaseSecret();
  if (!secret) return null;
  return `${SITE_ORIGIN}${RELEASE_PATH}?token=${encodeURIComponent(await signReleaseToken(e, secret))}`;
}

/* ------------------------------------------------- the Held enquiries page */

async function postHeld(id: string, e: Enquiry, reasons: string[], releaseUrl: string): Promise<boolean> {
  const url = env("HELD_ENQUIRIES_URL");
  const secret = env("HELD_ENQUIRIES_SECRET");
  if (!url || !secret) return false;
  const body = JSON.stringify({
    id,
    siteName: "Klaxon Studio",
    form: "Contact",
    sender: { name: e.name, email: e.email },
    message: (e.company ? `Company: ${e.company}\n\n` : "") + e.brief.slice(0, 3800),
    reasons: reasons.slice(0, 20),
    releaseUrl,
    filterVersion: SOLICITATION_FILTER_VERSION,
  });
  const timestamp = String(Math.floor(Date.now() / 1000));
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(`held.${timestamp}.${body}`))), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Boostkit-Timestamp": timestamp, "X-Boostkit-Signature": `sha256=${signature}` },
      body,
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) console.warn("[contact] Held enquiries page answered", response.status);
    return response.ok;
  } catch {
    console.warn("[contact] Held enquiries page could not be reached");
    return false;
  }
}

/* ------------------------------------------------------------- the route */

/**
 * Ask the gate (or the local filter) and act on the answer. Returns "deliver"
 * when the caller should email the studio, "handled" when nothing may go to it.
 */
export async function screen(e: Enquiry): Promise<"deliver" | "handled"> {
  const id = crypto.randomUUID();
  const releaseUrl = await releaseUrlFor(e).catch(() => null);
  const outcome = await gateEnquiry({
    submission: {
      id,
      form: "contact",
      name: e.name,
      email: e.email,
      message: e.brief,
      fields: { company: e.company },
      releaseUrl,
      siteName: "Klaxon Studio",
    },
    local: () =>
      screenEnquiry({
        site: KLAXON_SITE,
        form: "contact",
        input: { email: e.email, name: e.name, message: e.brief, business: KLAXON_BUSINESS },
        mode: "off",
      }),
  });

  if (outcome.action === "deliver") return "deliver";

  if (outcome.action === "owner-test") {
    try {
      await sendMattNotice(e, { test: true, reasons: outcome.reasons, releaseUrl: null });
    } catch (error) {
      console.error("[contact] Owner test notice failed:", error instanceof Error ? error.message : "error");
    }
    return "handled";
  }

  if (outcome.source === "gate") return "handled";

  // Held locally (the gate could not answer): the Held page and Matt's email.
  const posted = releaseUrl ? await postHeld(id, e, outcome.reasons, releaseUrl) : false;
  try {
    await sendMattNotice(e, { test: false, reasons: outcome.reasons, releaseUrl });
  } catch (error) {
    if (!posted) {
      console.error("[contact] No hold channel took a held enquiry, delivering instead:", error instanceof Error ? error.message : "error");
      return "deliver";
    }
  }
  console.warn("[contact] Held an enquiry locally:", { reasons: outcome.reasons });
  return "handled";
}

/** Everything after the rate limit: parse, honeypot, gate, deliver. */
export async function handleContact(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) return json({ ok: false, error: "Invalid submission" }, 400);
  const data = parsed.data;
  if (data.website) return json({ ok: true });

  if (!env("RESEND_API_KEY") || !env("RESEND_FROM_EMAIL") || !env("CONTACT_TO_EMAIL")) {
    console.error("[contact] Missing RESEND_API_KEY / RESEND_FROM_EMAIL / CONTACT_TO_EMAIL");
    return json({ ok: false, error: "Email not configured" }, 502);
  }

  const enquiry: Enquiry = { name: data.name, email: data.email, company: data.company ?? "", brief: data.brief };
  if ((await screen(enquiry)) === "handled") return json({ ok: true });

  try {
    await deliverEnquiry(enquiry);
  } catch (error) {
    console.error("[contact] Resend error", error instanceof Error ? error.message : "error");
    return json({ ok: false, error: "Email failed" }, 502);
  }
  return json({ ok: true });
}

/* ----------------------------------------------------------- the release */

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function page(title: string, body: string, status: number): Response {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="referrer" content="no-referrer"><title>${escapeHtml(title)}</title></head><body style="font-family:system-ui,sans-serif;max-width:640px;margin:40px auto;padding:0 16px;line-height:1.5"><h1 style="font-size:22px">${escapeHtml(title)}</h1>${body}</body></html>`;
  return new Response(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" },
  });
}

function rows(e: Enquiry): string {
  return `<table>${(["name", "email", "company", "brief"] as const)
    .map((k) => `<tr><td style="padding:6px 12px 6px 0;vertical-align:top"><strong>${k}</strong></td><td style="white-space:pre-wrap">${escapeHtml(e[k] ?? "")}</td></tr>`)
    .join("")}</table>`;
}

/** GET shows a confirmation page and never sends; POST (its button, or the Held page) delivers. */
export async function handleRelease(request: Request, send: boolean): Promise<Response> {
  const secret = releaseSecret();
  if (!secret) return page("Release is not configured", "<p>SOLICITATION_RELEASE_SECRET is not set. Nothing was sent.</p>", 500);
  let token = new URL(request.url).searchParams.get("token");
  if (send && (request.headers.get("content-type") ?? "").includes("application/x-www-form-urlencoded")) {
    const value = new URLSearchParams(await request.text()).get("token");
    if (value) token = value;
  }
  const verified = token ? await verifyReleaseToken(token, secret) : { status: "invalid" as const };
  if (verified.status === "invalid" || !token) return page("Release link is not valid", "<p>Nothing was sent.</p>", 400);
  if (verified.status === "expired") return page("Release link has expired", `<p>Nothing was sent to Klaxon Studio.</p>${rows(verified.enquiry)}`, 410);
  if (isOwnerTest(verified.enquiry.email)) {
    return page("Test enquiry", "<p>This was a test from a boostkit.io address. It is never sent to Klaxon Studio.</p>", 200);
  }
  if (!send) {
    return page(
      "Release to Klaxon Studio",
      `<p>Nothing has been sent yet. The button emails this enquiry to Klaxon Studio exactly as a normal website enquiry.</p>${rows(verified.enquiry)}
      <form method="post" action="${RELEASE_PATH}"><input type="hidden" name="token" value="${escapeHtml(token)}"><button type="submit" style="margin-top:16px;padding:10px 18px;font-size:16px">Release to Klaxon Studio</button></form>`,
      200
    );
  }
  try {
    await deliverEnquiry(verified.enquiry);
  } catch (error) {
    console.error("[contact release] Delivery failed:", error instanceof Error ? error.message : "error");
    return page("Release failed", `<p>The email did not send. Try again shortly.</p>${rows(verified.enquiry)}`, 502);
  }
  console.log("[contact release] Released a held enquiry");
  return page("Sent to Klaxon Studio", "<p>The enquiry was emailed to Klaxon Studio as a normal website enquiry. Pressing the button again would send it a second time.</p>", 200);
}
