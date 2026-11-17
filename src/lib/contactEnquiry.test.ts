// Route tests for the contact form and the central enquiry gate. Run with
// `node --test` (Node 24 strips the types). Every external call is a mocked fetch.
import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
// @ts-expect-error: node --test needs the .ts extension (tsc does not allow it here)
import { handleContact, handleRelease, signReleaseToken } from "./contactEnquiry.ts";
// @ts-expect-error: node --test needs the .ts extension (tsc does not allow it here)
import { resetGateClient } from "./gateClient.ts";

const RESEND = "https://api.resend.com/emails";
const GATE = "https://crm.boostkit.io/leads/gate/klaxon-studio";
const HELD = "https://crm.boostkit.io/leads/held/klaxon-studio";
const SECRET = "0123456789abcdef0123456789abcdef";
const CLIENT = "hello@klaxon.example";

type Call = { url: string; body: Record<string, unknown> };
let calls: Call[] = [];
let respond: (url: string, init?: RequestInit) => Promise<Response>;
const originalFetch = globalThis.fetch;
const saved = { ...process.env };

const clean = { name: "Jo Bloggs", email: "jo.bloggs@example.co.uk", company: "Acme", brief: "We need a 30 second advert for our spring launch.", website: "" };
const ownerTest = { name: "Matt", email: "matt@boostkit.io", company: "", brief: "Test. Ignore this enquiry.", website: "" };
const junk = { name: "Lzpfstw Bdmgvjgd", email: "lzp.fs.tw.b@gmail.com", company: "", brief: "ZdklGrSEIEbPSeYOculkrmS", website: "" };

function post(body: object): Request {
  return new Request("https://klaxon.studio/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
}
const answer = (action: string) => async (url: string) =>
  url === GATE ? new Response(JSON.stringify({ ok: true, action, id: "g1", reasons: [] }), { status: 200 }) : new Response("{}", { status: 200 });
const sentTo = () => calls.filter((c) => c.url === RESEND).map((c) => c.body.to);

beforeEach(() => {
  resetGateClient();
  calls = [];
  respond = async () => new Response("{}", { status: 200 });
  Object.assign(process.env, {
    RESEND_API_KEY: "re_test",
    RESEND_FROM_EMAIL: "Klaxon <web@klaxon.example>",
    CONTACT_TO_EMAIL: CLIENT,
    HELD_ENQUIRIES_URL: HELD,
    HELD_ENQUIRIES_SECRET: "site-secret",
    SOLICITATION_RELEASE_SECRET: SECRET,
  });
  delete process.env.ENQUIRY_GATE;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    calls.push({ url: input.toString(), body: JSON.parse(init?.body?.toString() || "{}") });
    return respond(input.toString(), init);
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  for (const key of Object.keys(process.env)) if (!(key in saved)) delete process.env[key];
  Object.assign(process.env, saved);
});

describe("contact form and the enquiry gate", () => {
  it("gate deliver: emails the studio after a signed gate request with the release link", async () => {
    respond = answer("deliver");
    const res = await handleContact(post(clean));
    assert.deepEqual(await res.json(), { ok: true });
    assert.equal(calls[0].url, GATE);
    assert.match(String(calls[0].body.releaseUrl), /^https:\/\/klaxon\.studio\/api\/contact\/release\?token=/);
    assert.deepEqual(sentTo(), [CLIENT]);
  });

  it("gate hold: sends nothing else", async () => {
    respond = answer("hold");
    const res = await handleContact(post(clean));
    assert.deepEqual(await res.json(), { ok: true });
    assert.deepEqual(calls.map((c) => c.url), [GATE]);
  });

  it("gate owner-test: Matt only, marked Test, never the studio", async () => {
    respond = answer("owner-test");
    const res = await handleContact(post(ownerTest));
    assert.deepEqual(await res.json(), { ok: true });
    assert.deepEqual(sentTo(), ["matt@boostkit.io"]);
    assert.match(String(calls.find((c) => c.url === RESEND)!.body.subject), /^\[Klaxon\] Test/);
    assert.ok(!calls.some((c) => c.url === HELD));
  });

  it("gate down: an owner test still never reaches the studio, even if Matt's email fails", async () => {
    respond = async (url) => {
      if (url.startsWith(GATE)) throw new Error("down");
      return new Response("no", { status: 500 });
    };
    const res = await handleContact(post(ownerTest));
    assert.deepEqual(await res.json(), { ok: true });
    assert.ok(!sentTo().includes(CLIENT));
  });

  it("gate times out: the local filter holds random letters for Matt and the Held page", { timeout: 10000 }, async () => {
    respond = async (url, init) => {
      if (url === GATE) {
        return await new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener("abort", () => reject(Object.assign(new Error("aborted"), { name: "AbortError" })));
        });
      }
      return new Response("{}", { status: 202 });
    };
    const res = await handleContact(post(junk));
    assert.deepEqual(await res.json(), { ok: true });
    assert.deepEqual(sentTo(), ["matt@boostkit.io"]);
    const held = calls.find((c) => c.url === HELD);
    assert.ok(held);
    assert.ok((held.body.reasons as string[]).some((r) => r.startsWith("bot:")));
  });

  it("gate fails: a clean enquiry is still delivered", async () => {
    respond = async (url) => (url.startsWith(GATE) ? new Response("boom", { status: 500 }) : new Response("{}", { status: 200 }));
    await handleContact(post(clean));
    assert.ok(sentTo().includes(CLIENT));
  });

  it("not configured: decides locally and a clean enquiry is delivered", async () => {
    delete process.env.HELD_ENQUIRIES_URL;
    await handleContact(post(clean));
    assert.deepEqual(sentTo(), [CLIENT]);
  });

  it("the honeypot answers ok and sends nothing", async () => {
    const res = await handleContact(post({ ...clean, website: "x" }));
    assert.equal(res.status, 400);
    assert.equal(calls.length, 0);
  });
});

describe("release", () => {
  const token = (e: object) => signReleaseToken({ company: "", ...e } as never, SECRET);
  const releasePost = (t: string) =>
    new Request("https://klaxon.studio/api/contact/release", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ token: t }).toString(),
    });

  it("GET confirms and sends nothing; POST emails the studio", async () => {
    const t = await token(clean);
    const confirm = await handleRelease(new Request(`https://klaxon.studio/api/contact/release?token=${encodeURIComponent(t)}`), false);
    assert.equal(confirm.status, 200);
    assert.equal(calls.length, 0);
    const sent = await handleRelease(releasePost(t), true);
    assert.equal(sent.status, 200);
    assert.deepEqual(sentTo(), [CLIENT]);
  });

  it("refuses a tampered token", async () => {
    const t = await token(clean);
    const res = await handleRelease(releasePost(t.slice(0, -2) + "xx"), true);
    assert.equal(res.status, 400);
    assert.equal(calls.length, 0);
  });

  it("never releases an owner test", async () => {
    const res = await handleRelease(releasePost(await token(ownerTest)), true);
    assert.equal(res.status, 200);
    assert.equal(calls.length, 0);
  });
});
