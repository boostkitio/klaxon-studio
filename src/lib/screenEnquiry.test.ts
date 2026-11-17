// Run with: node --test screenEnquiry.test.ts   (Node 24 strips the types)
// Uses only node:test and a fake fetch, so it never calls TypeSafe.
import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import {
    DELIVER_IF,
    HOLD_IF,
    JEV_MODEL,
    JEV_QUESTIONS,
    JUNK_IF,
    PITCH_JEV_VERSION,
    buildJevRequest,
    isWordsOnly,
    jevVerdict,
    readMode,
    redactContactDetails,
    resetJevCap,
    screenEnquiry,
    type ScreenOptions,
    type ScreenSite,
    // @ts-expect-error Node's strip-types runner imports the TypeScript file directly.
} from "./solicitation.ts";

const FULL: ScreenSite = { id: "test-full", description: "A plumber in Kent", holdWords: true };
const SOFT: ScreenSite = { id: "test-soft", description: "A pub in Kent", holdWords: false };

const BOOKING = {
    name: "Pat Example",
    email: "pat@example.com",
    subject: "booking",
    message: "Table for 15 please. The number on the website isn't recognised.",
};
const CLEAN = { name: "Pat", email: "pat@example.com", message: "Can you fix a dripping tap on Tuesday?" };
const PHRASE_PITCH = { name: "Sam", email: "sam@example.com", message: "We offer a free audit of your website and more reviews." };
const SPACED_BOT = { name: "Solzzg Yaekw", email: "solzzg@gmail.com", message: "Solzzg yaekw gorxmnu cqaacaa" };

const CUSTOMER = { customer: 0.99, selling: 0.01, gibberish: 0.01, spam: 0.02 };
const PITCH = { customer: 0.05, selling: 0.98, gibberish: 0.01, spam: 0.4 };
const GIBBERISH = { customer: 0.65, selling: 0.22, gibberish: 0.87, spam: 0.74 };
const SPAM = { customer: 0.4, selling: 0.4, gibberish: 0.01, spam: 0.95 };
const UNSURE = { customer: 0.43, selling: 0.17, gibberish: 0.01, spam: 0.05 };

type SentBody = { model: string; state: { business: string; message: { subject?: string; text: string } }; questions: Record<string, unknown> };
type Call = { url: string; body: SentBody; headers: Record<string, string> };

function fakeFetch(answers: Record<string, number> | null, options: { status?: number; hang?: boolean; throws?: boolean } = {}) {
    const calls: Call[] = [];
    const impl = (async (url: string, init: RequestInit) => {
        calls.push({ url, body: JSON.parse(String(init.body)), headers: init.headers as Record<string, string> });
        if (options.throws) throw new TypeError("fetch failed");
        if (options.hang) {
            await new Promise((_, reject) => init.signal?.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" }))));
        }
        const answerBody: Record<string, unknown> = {};
        for (const [name, value] of Object.entries(answers ?? {})) answerBody[name] = { type: "noul", noul: value };
        return new Response(JSON.stringify({ model: JEV_MODEL, answers: answerBody, usage: { input_tokens: 800, output_tokens: 20 } }), { status: options.status ?? 200 });
    }) as unknown as typeof fetch;
    return { impl, calls };
}

async function run(site: ScreenSite, input: object, env: Record<string, string>, fetchImpl: typeof fetch, extra: Partial<ScreenOptions> = {}) {
    const lines: string[] = [];
    const result = await screenEnquiry({ site, form: "contact", input, env, fetchImpl, log: (line: string) => lines.push(line), ...extra });
    return { result, lines };
}

const KEY = { TYPESAFE_API_KEY: "test-key" };
const ON = { ...KEY, PITCH_JEV_MODE: "on" };

beforeEach(() => resetJevCap());

describe("screenEnquiry: version and helpers", () => {
    it("is Jev 2.1.0 on jev-1.14.0 with four questions", () => {
        assert.equal(PITCH_JEV_VERSION, "2.1.0");
        assert.equal(JEV_MODEL, "jev-1.14.0");
        assert.deepEqual(Object.keys(JEV_QUESTIONS), ["customer", "selling", "gibberish", "spam"]);
        assert.deepEqual(JUNK_IF, { gibberishMin: 0.7, spamMin: 0.7, spamWithLowCustomerMin: 0.5, lowCustomerMax: 0.2 });
        assert.deepEqual(HOLD_IF, { sellingMin: 0.7, customerMax: 0.3 });
        assert.deepEqual(DELIVER_IF, { customerMin: 0.7, sellingMax: 0.3 });
    });

    it("reads the mode, defaulting to off", () => {
        assert.equal(readMode(undefined), "off");
        assert.equal(readMode("ON"), "on");
        assert.equal(readMode(" shadow "), "shadow");
        assert.equal(readMode("yes"), "off");
    });

    it("is words-only only when every reason is a hold word", () => {
        assert.equal(isWordsOnly({ blocked: true, reasons: ["word:website"] }), true);
        assert.equal(isWordsOnly({ blocked: true, reasons: ["word:website", "phrase:free audit"] }), false);
        assert.equal(isWordsOnly({ blocked: true, reasons: ["word:website", "bot:random-letters"] }), false);
        assert.equal(isWordsOnly({ blocked: false, reasons: [] }), false);
    });

    it("follows the truth table", () => {
        assert.equal(jevVerdict(GIBBERISH, "clean"), "junk");
        assert.equal(jevVerdict(SPAM, "clean"), "junk");
        assert.equal(jevVerdict(PITCH, "clean"), "pitch");
        assert.equal(jevVerdict(CUSTOMER, "clean"), "clean");
        assert.equal(jevVerdict(UNSURE, "clean"), "clean");
        assert.equal(jevVerdict(CUSTOMER, "words-only"), "customer");
        assert.equal(jevVerdict(UNSURE, "words-only"), "unsure");
        assert.equal(jevVerdict(PITCH, "words-only"), "pitch");
        assert.equal(jevVerdict({ ...CUSTOMER, gibberish: 0.7 }, "words-only"), "junk");
        // Jev 2.1.0: middling spam counts only when the sender clearly is not a customer.
        assert.equal(jevVerdict({ customer: 0.11, selling: 0.03, gibberish: 0.01, spam: 0.53 }, "clean"), "junk");
        assert.equal(jevVerdict({ customer: 0.32, selling: 0.02, gibberish: 0.01, spam: 0.52 }, "clean"), "clean");
    });

    it("redacts contact details and never sends the name or email", () => {
        assert.equal(redactContactDetails("Call 07961 217007 or +44 (0)7961 217007, a@b.co.uk, TN4 0HE"), "Call [phone] or [phone], [email], [postcode]");
        const body = buildJevRequest(FULL, "Hi", "Ring me on 07961217007");
        assert.deepEqual(body.state, { business: "A plumber in Kent", message: { subject: "Hi", text: "Ring me on [phone]" } });
    });
});

describe("screenEnquiry: rules and owner tests come first", () => {
    it("returns owner-test for an @boostkit.io sender, with no call, in any mode", async () => {
        const f = fakeFetch(CUSTOMER);
        const { result } = await run(FULL, { name: "Matt", email: "matt@boostkit.io", subject: "Test", message: "Ignore" }, ON, f.impl);
        assert.deepEqual(result, { action: "owner-test", blocked: true, reasons: ["owner-test"], jev: null });
        assert.equal(f.calls.length, 0);
    });

    it("holds rule holds other than hold words with no call", async () => {
        for (const input of [PHRASE_PITCH, { ...BOOKING, email: "x@ringful.pro" }, { ...CLEAN, message: "ZdklGrSEIEbPSeYOculkrm" }]) {
            const f = fakeFetch(CUSTOMER);
            const { result } = await run(FULL, input, ON, f.impl);
            assert.equal(result.action, "hold");
            assert.equal(result.jev, null);
            assert.equal(f.calls.length, 0);
        }
    });

    it("keeps a hold word plus a bot-shape reason held, with no call, on full and soft sites", async () => {
        const input = { ...BOOKING, message: `${BOOKING.message}\nklMamIwGvuzblSPUPO` };
        for (const site of [FULL, SOFT]) {
            const f = fakeFetch(CUSTOMER);
            const { result } = await run(site, input, ON, f.impl);
            assert.equal(result.action, "hold");
            assert.ok(result.reasons.includes("bot:random-letters"), result.reasons.join(", "));
            assert.equal(f.calls.length, 0);
        }
    });

    it("keeps a hold word that is only in the name held on a full site, with no call (Jev cannot see names)", async () => {
        const f = fakeFetch(CUSTOMER);
        const { result } = await run(FULL, { name: "Rank1 SEO", email: "x@example.com", message: "Please call me back about a job." }, ON, f.impl);
        assert.equal(result.action, "hold");
        assert.equal(f.calls.length, 0);
    });

    it("does not call Jev when there is no subject or message", async () => {
        const f = fakeFetch(CUSTOMER);
        const { result } = await run(FULL, { name: "Pat", email: "pat@example.com" }, ON, f.impl);
        assert.equal(result.action, "deliver");
        assert.equal(f.calls.length, 0);
    });

    it("does nothing new when the mode is off", async () => {
        const f = fakeFetch(CUSTOMER);
        const { result, lines } = await run(FULL, CLEAN, KEY, f.impl);
        assert.deepEqual(result, { action: "deliver", blocked: false, reasons: [], jev: null });
        assert.equal(f.calls.length, 0);
        assert.equal(lines.length, 0);
    });

    it("works with no check passed (uses this file's) and with an older caller's check", async () => {
        const f = fakeFetch(CUSTOMER);
        const own = await run(FULL, CLEAN, ON, f.impl);
        const passed = await run(FULL, CLEAN, ON, f.impl, { check: () => ({ blocked: false, reasons: [] }) });
        assert.equal(own.result.action, "deliver");
        assert.equal(passed.result.action, "deliver");
    });
});

describe("screenEnquiry: Jev on everything the rules deliver", () => {
    it("asks once, with four questions, and delivers a clean customer", async () => {
        const f = fakeFetch(CUSTOMER);
        const { result } = await run(FULL, CLEAN, ON, f.impl);
        assert.equal(result.action, "deliver");
        assert.deepEqual(result.reasons, []);
        assert.equal(result.jev?.path, "clean");
        assert.equal(result.jev?.verdict, "clean");
        assert.equal(f.calls.length, 1);
        assert.deepEqual(Object.keys(f.calls[0].body.questions), ["customer", "selling", "gibberish", "spam"]);
        assert.equal(f.calls[0].headers.Authorization, "Bearer test-key");
    });

    it("holds spaced random words the rules miss", async () => {
        const f = fakeFetch(GIBBERISH);
        const { result } = await run(FULL, SPACED_BOT, ON, f.impl);
        assert.equal(result.action, "hold");
        assert.deepEqual(result.reasons, ["jev:junk (gibberish 0.87, spam 0.74)"]);
    });

    it("holds unrelated spam and a clear pitch the rules miss, on soft sites too", async () => {
        for (const [answers, reason] of [[SPAM, "jev:junk (gibberish 0.01, spam 0.95)"], [PITCH, "jev:pitch (customer 0.05, selling 0.98)"]] as const) {
            for (const site of [FULL, SOFT]) {
                const { result } = await run(site, CLEAN, ON, fakeFetch(answers).impl);
                assert.equal(result.action, "hold");
                assert.deepEqual(result.reasons, [reason]);
            }
        }
    });

    it("delivers an unsure clean message (only a confident junk or pitch answer holds)", async () => {
        const { result } = await run(FULL, CLEAN, ON, fakeFetch(UNSURE).impl);
        assert.equal(result.action, "deliver");
    });

    it("shadow: asks and logs, but the rules decide", async () => {
        const { result, lines } = await run(FULL, SPACED_BOT, { ...KEY, PITCH_JEV_MODE: "shadow" }, fakeFetch(GIBBERISH).impl);
        assert.equal(result.action, "deliver");
        assert.equal(result.jev?.verdict, "junk");
        assert.equal(lines.length, 1);
    });

    it("takes mode and key as options (the central gate)", async () => {
        const f = fakeFetch(GIBBERISH);
        const { result } = await run(FULL, SPACED_BOT, {}, f.impl, { mode: "on", apiKey: "gate-key", timeoutMs: 2000, cap: false });
        assert.equal(result.action, "hold");
        assert.equal(f.calls[0].headers.Authorization, "Bearer gate-key");
    });
});

describe("screenEnquiry: hold-word holds", () => {
    it("full site: delivers a clear customer, with Jev's reason", async () => {
        const { result } = await run(FULL, BOOKING, ON, fakeFetch(CUSTOMER).impl);
        assert.equal(result.action, "deliver");
        assert.equal(result.jev?.path, "words-only");
        assert.deepEqual(result.reasons, ["word:website", "jev:customer (customer 0.99, selling 0.01)"]);
    });

    it("full site: keeps an unsure answer held, as before", async () => {
        const { result } = await run(FULL, BOOKING, ON, fakeFetch(UNSURE).impl);
        assert.equal(result.action, "hold");
        assert.deepEqual(result.reasons, ["word:website"]);
    });

    it("full site: keeps a customer-sounding message held when Jev calls it junk", async () => {
        const { result } = await run(FULL, BOOKING, ON, fakeFetch({ ...CUSTOMER, spam: 0.9 }).impl);
        assert.equal(result.action, "hold");
    });

    it("soft site: hold words never held it, so it is a clean path", async () => {
        const { result } = await run(SOFT, BOOKING, ON, fakeFetch(CUSTOMER).impl);
        assert.equal(result.action, "deliver");
        assert.equal(result.jev?.path, "clean");
    });
});

describe("screenEnquiry: fail-open keeps the rules' verdict", () => {
    const cases: Array<[string, Record<string, string>, ReturnType<typeof fakeFetch>]> = [
        ["no key", { PITCH_JEV_MODE: "on" }, fakeFetch(GIBBERISH)],
        ["HTTP error", ON, fakeFetch(GIBBERISH, { status: 500 })],
        ["network error", ON, fakeFetch(GIBBERISH, { throws: true })],
        ["missing answer", ON, fakeFetch({ customer: 0.1, selling: 0.1 })],
    ];
    for (const [label, env, f] of cases) {
        it(`delivers a rules-clean message on ${label}`, async () => {
            const { result } = await run(FULL, SPACED_BOT, env, f.impl);
            assert.equal(result.action, "deliver");
            assert.ok(result.jev?.error);
        });
    }

    it("delivers on timeout", async () => {
        const { result } = await run(FULL, SPACED_BOT, ON, fakeFetch(GIBBERISH, { hang: true }).impl, { timeoutMs: 20 });
        assert.equal(result.action, "deliver");
        assert.equal(result.jev?.error, "timeout");
    });

    it("keeps a hold-word hold held on failure", async () => {
        const { result } = await run(FULL, BOOKING, ON, fakeFetch(CUSTOMER, { status: 503 }).impl);
        assert.equal(result.action, "hold");
    });

    it("stops calling at the daily cap, and the gate can switch the cap off", async () => {
        const f = fakeFetch(CUSTOMER);
        const env = { ...ON, PITCH_JEV_DAILY_CAP: "2" };
        for (let i = 0; i < 3; i++) await run(FULL, CLEAN, env, f.impl);
        assert.equal(f.calls.length, 2);
        const { result } = await run(FULL, CLEAN, env, f.impl);
        assert.equal(result.jev?.error, "daily-cap");
        await run(FULL, CLEAN, env, f.impl, { cap: false });
        assert.equal(f.calls.length, 3);
    });

    it("logs one line with no message text or personal data", async () => {
        const { lines } = await run(FULL, BOOKING, ON, fakeFetch(CUSTOMER).impl);
        assert.equal(lines.length, 1);
        for (const secret of ["Table for 15", "Pat", "example.com", "test-key"]) assert.ok(!lines[0].includes(secret), secret);
    });
});
