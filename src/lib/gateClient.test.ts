// Tests for gateClient.ts. Run: node --test gateClient.test.ts (Node 24). Copy verbatim with the file.
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { beforeEach, describe, it } from "node:test";

import {
    GATE_CLIENT_VERSION,
    gateEnquiry,
    gateUrl,
    isOwnerTest,
    pendingReports,
    resetGateClient,
    signedHeaders,
    type GateSubmission,
    // @ts-expect-error Node's strip-types runner imports the TypeScript file directly.
} from "./gateClient.ts";

const ENV = { HELD_ENQUIRIES_URL: "https://crm.boostkit.io/leads/held/signatureautorepairs-co-uk", HELD_ENQUIRIES_SECRET: "hsk_test" };
const GATE = "https://crm.boostkit.io/leads/gate/signatureautorepairs-co-uk";
const SUBMISSION: GateSubmission = { id: "sub-1", form: "contact", name: "Fay Pullen", email: "fay@example.co.uk", message: "Quote for a dented bumper please", releaseUrl: "https://signatureautorepairs.co.uk/api/enquiry/release?token=t" };
const quiet = () => {};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
const neverLocal = () => {
    throw new Error("local filter must not run");
};

type Call = { url: string; init: RequestInit };

describe("gateClient", () => {
    beforeEach(() => resetGateClient());

    it("is version 1.0.0", () => assert.equal(GATE_CLIENT_VERSION, "1.0.0"));

    it("derives the gate address from the held enquiries address, or takes ENQUIRY_GATE_URL", () => {
        assert.equal(gateUrl(ENV), GATE);
        assert.equal(gateUrl({ ...ENV, ENQUIRY_GATE_URL: "https://x.example/leads/gate/a" }), "https://x.example/leads/gate/a");
        assert.equal(gateUrl({}), null);
    });

    it("signs gate.<timestamp>.<body> with the site's secret, as the platform checks it", async () => {
        const headers = await signedHeaders("gate", "hsk_test", '{"a":1}', 1_700_000_000_000);
        assert.equal(headers["X-Boostkit-Timestamp"], "1700000000");
        const expected = createHmac("sha256", "hsk_test").update('gate.1700000000.{"a":1}').digest("hex");
        assert.equal(headers["X-Boostkit-Signature"], `sha256=${expected}`);
        const report = await signedHeaders("gatereport", "hsk_test", "{}", 1_700_000_000_000);
        assert.notEqual(report["X-Boostkit-Signature"], headers["X-Boostkit-Signature"]);
    });

    it("owner tests: exactly boostkit.io, any case, never a look-alike", () => {
        assert.equal(isOwnerTest("Matt@Boostkit.IO"), true);
        assert.equal(isOwnerTest("matt@boostkit.io.example.com"), false);
        assert.equal(isOwnerTest("matt@notboostkit.io"), false);
        assert.equal(isOwnerTest(""), false);
    });

    for (const action of ["deliver", "hold", "owner-test"] as const) {
        it(`returns the gate's "${action}" and does not run the local filter`, async () => {
            const calls: Call[] = [];
            const outcome = await gateEnquiry({ submission: SUBMISSION, local: neverLocal, env: ENV, log: quiet, fetchImpl: (async (url: string, init: RequestInit) => (calls.push({ url, init }), json({ ok: true, action, id: "g1", reasons: ["r"] }))) as typeof fetch });
            assert.deepEqual(outcome, { action, id: "g1", reasons: ["r"], source: "gate" });
            assert.equal(calls.length, 1);
            assert.equal(calls[0].url, GATE);
            const sent = JSON.parse(String(calls[0].init.body));
            assert.equal(sent.id, "sub-1");
            assert.equal(sent.releaseUrl, SUBMISSION.releaseUrl);
        });
    }

    it("falls back to the local filter on a timeout, and reports it with the next good call", async () => {
        const hang = (async (_url: string, init: RequestInit) =>
            new Promise((_resolve, reject) => init.signal?.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" }))))) as typeof fetch;
        const started = Date.now();
        const outcome = await gateEnquiry({ submission: SUBMISSION, local: () => ({ blocked: true, reasons: ["bot:random-letters"] }), env: ENV, log: quiet, fetchImpl: hang, timeoutMs: 50 });
        assert.ok(Date.now() - started < 1000);
        assert.deepEqual(outcome, { action: "hold", id: null, reasons: ["bot:random-letters"], source: "local", error: "timeout" });
        assert.equal(pendingReports().length, 1);

        const calls: Call[] = [];
        await gateEnquiry({
            submission: { ...SUBMISSION, id: "sub-2" },
            local: neverLocal,
            env: ENV,
            log: quiet,
            fetchImpl: (async (url: string, init: RequestInit) => {
                calls.push({ url, init });
                return url.endsWith("/report") ? json({ ok: true, stored: 1 }, 202) : json({ ok: true, action: "deliver", id: "g2", reasons: [] });
            }) as typeof fetch,
        });
        assert.equal(calls[1].url, `${GATE}/report`);
        const report = JSON.parse(String(calls[1].init.body));
        assert.deepEqual(report.fallbacks.map((item: { id: string; decided: string; error: string }) => [item.id, item.decided, item.error]), [["sub-1", "hold", "timeout"]]);
        assert.match(String((calls[1].init.headers as Record<string, string>)["X-Boostkit-Signature"]), /^sha256=[0-9a-f]{64}$/);
        assert.equal(pendingReports().length, 0);
    });

    it("falls back on a 5xx and reports straight away", async () => {
        const calls: string[] = [];
        const outcome = await gateEnquiry({
            submission: SUBMISSION,
            local: async () => ({ blocked: false, reasons: [] }),
            env: ENV,
            log: quiet,
            fetchImpl: (async (url: string) => (calls.push(url), url.endsWith("/report") ? json({ ok: true }, 202) : json({ ok: false }, 500))) as typeof fetch,
        });
        assert.deepEqual([outcome.action, outcome.source, outcome.error], ["deliver", "local", "http-500"]);
        assert.deepEqual(calls, [GATE, `${GATE}/report`]);
        assert.equal(pendingReports().length, 0);
    });

    it("an answer that is not a decision is a fallback", async () => {
        const outcome = await gateEnquiry({ submission: SUBMISSION, local: () => ({ blocked: false, reasons: [] }), env: ENV, log: quiet, fetchImpl: (async (url: string) => (url.endsWith("/report") ? json({}, 202) : json({ ok: true, action: "maybe" }))) as typeof fetch });
        assert.equal(outcome.error, "bad-answer");
    });

    it("owner tests still go to Matt only when the gate is down", async () => {
        const outcome = await gateEnquiry({ submission: { ...SUBMISSION, email: "matt@boostkit.io" }, local: neverLocal, env: ENV, log: quiet, fetchImpl: (async () => { throw new TypeError("fetch failed"); }) as typeof fetch });
        assert.deepEqual([outcome.action, outcome.source, outcome.error], ["owner-test", "local", "network"]);
    });

    it("never drops a submission: a failing local filter delivers", async () => {
        const outcome = await gateEnquiry({ submission: SUBMISSION, local: () => { throw new Error("boom"); }, env: ENV, log: quiet, fetchImpl: (async () => { throw new TypeError("fetch failed"); }) as typeof fetch });
        assert.deepEqual([outcome.action, outcome.reasons], ["deliver", ["local-filter-failed"]]);
    });

    it("decides locally, with no call, when not configured or switched off", async () => {
        let called = false;
        const fetchImpl = (async () => ((called = true), json({}))) as typeof fetch;
        let outcome = await gateEnquiry({ submission: SUBMISSION, local: () => ({ blocked: true, reasons: ["word:seo"] }), env: {}, log: quiet, fetchImpl });
        assert.deepEqual([outcome.action, outcome.error], ["hold", "not-configured"]);
        outcome = await gateEnquiry({ submission: SUBMISSION, local: () => ({ blocked: false, reasons: [] }), env: { ...ENV, ENQUIRY_GATE: "off" }, log: quiet, fetchImpl });
        assert.deepEqual([outcome.action, outcome.error], ["deliver", "off"]);
        assert.equal(called, false);
        assert.equal(pendingReports().length, 0, "nothing to report when the gate was never asked");
    });

    it("logs no message text, name, email or secret", async () => {
        const lines: string[] = [];
        await gateEnquiry({ submission: SUBMISSION, local: () => ({ blocked: false, reasons: [] }), env: ENV, log: (line) => lines.push(line), fetchImpl: (async () => { throw new TypeError("fetch failed"); }) as typeof fetch });
        const text = lines.join("\n");
        assert.doesNotMatch(text, /Fay|fay@|bumper|hsk_test/);
    });
});
