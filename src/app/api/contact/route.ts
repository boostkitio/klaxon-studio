// Contact form endpoint: rate limit, then src/lib/contactEnquiry.ts (validation,
// honeypot, the central enquiry gate, then Resend). See docs/enquiry-filtering.md.
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { handleContact } from "@/lib/contactEnquiry";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
  const rl = checkRateLimit(`contact:${ip}`);
  if (!rl.ok) {
    const retryAfterSec = Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000));
    return NextResponse.json(
      { ok: false, error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
    );
  }
  return handleContact(req);
}
