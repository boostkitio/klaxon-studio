"use client";

import { useState, type FormEvent } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { Button } from "@/components/ui/Button";
import { HighlightWipe } from "@/components/ScrollHighlight";
import { contactRows } from "@/lib/content";

type FormState = "idle" | "sending" | "sent" | "error";

export default function ContactPage() {
  const [state, setState] = useState<FormState>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name") ?? "",
          email: fd.get("email") ?? "",
          company: fd.get("company") ?? "",
          brief: fd.get("brief") ?? "",
          website: fd.get("website") ?? "",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      setState("sent");
      // The form posts via fetch after preventDefault, so GA4's automatic
      // form_submit never represents a completed enquiry. This is the only
      // signal that a lead actually landed. Mark generate_lead as a key
      // event in GA4 or conversions stay invisible. Never let an analytics
      // failure surface as a failed submission: the email has already sent.
      try {
        sendGAEvent("event", "generate_lead", { form_name: "contact" });
      } catch {
        // Swallowed deliberately, see above.
      }
    } catch {
      setState("error");
    }
  }

  return (
    <main>
      {/* CORAL STATEMENT HERO */}
      <section className="bg-[var(--brand)] text-white pt-[clamp(72px,9vw,128px)] pb-[clamp(64px,8vw,112px)]">
        <div
          className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] grid gap-[clamp(32px,4vw,64px)] items-end"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}
        >
          <div>
            <span className="inline-flex items-center gap-[11px] font-mono font-medium text-[12px] tracking-[0.12em] uppercase text-white mb-[clamp(28px,4vw,44px)]">
              <span className="w-[4px] h-[1em] bg-white" />
              Get in touch
            </span>
            <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[0.97] tracking-[-0.04em] whitespace-nowrap text-white">
              Now we&apos;re{" "}
              <HighlightWipe from="#fff" to="var(--brand)" trigger="page">
                talking.
              </HighlightWipe>
            </h1>
          </div>
          <p className="text-[clamp(14px,1.3vw,15px)] leading-[1.6] text-white/85 max-w-[46ch]">
            Got a brief, a budget, or just the bones of an idea? However you reach us, we&apos;ll work out together
            what the project actually needs.
          </p>
        </div>
      </section>

      {/* LIGHT FORM BAND */}
      <section className="bg-[var(--surface-page)] text-[#1A1A1A] py-[clamp(64px,8vw,120px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <form onSubmit={onSubmit} className="w-full flex flex-col gap-[clamp(26px,3vw,38px)]">
            <div className="grid gap-[clamp(26px,3vw,38px)]" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}>
              <div className="flex flex-col gap-[10px]">
                <label htmlFor="name" className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
                  Your name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Jane Smith"
                  className="py-[11px] px-[2px] bg-transparent border-0 border-b border-[var(--border-subtle)] font-body text-[clamp(15px,1.5vw,17px)] text-[#1A1A1A] outline-none focus:border-[var(--brand)] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-[10px]">
                <label htmlFor="email" className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@company.com"
                  className="py-[11px] px-[2px] bg-transparent border-0 border-b border-[var(--border-subtle)] font-body text-[clamp(15px,1.5vw,17px)] text-[#1A1A1A] outline-none focus:border-[var(--brand)] transition-colors"
                />
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <label htmlFor="company" className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Where you're from"
                className="py-[11px] px-[2px] bg-transparent border-0 border-b border-[var(--border-subtle)] font-body text-[clamp(15px,1.5vw,17px)] text-[#1A1A1A] outline-none focus:border-[var(--brand)] transition-colors"
              />
            </div>
            <div className="flex flex-col gap-[10px]">
              <label htmlFor="brief" className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
                What&apos;s the brief?
              </label>
              <textarea
                id="brief"
                name="brief"
                rows={4}
                required
                placeholder="Tell us what you've got in mind…"
                className="py-[11px] px-[2px] bg-transparent border-0 border-b border-[var(--border-subtle)] font-body text-[clamp(15px,1.5vw,17px)] leading-[1.55] text-[#1A1A1A] outline-none focus:border-[var(--brand)] transition-colors resize-y"
              />
            </div>
            {/* Honeypot — hidden from real users, catches naive bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] top-auto w-px h-px overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="flex flex-wrap items-center gap-[18px] mt-1">
              <Button
                type="submit"
                variant="primary"
                disabled={state === "sending" || state === "sent"}
                className="hover:!bg-[#1A1A1A] hover:!text-white hover:!border-[#1A1A1A] disabled:opacity-60"
              >
                {state === "sending" ? "Sending…" : state === "sent" ? "Sent, thank you" : "Send it over"}
              </Button>
              <span className="font-mono font-medium text-[10px] tracking-[0.12em] uppercase text-[var(--text-muted)]">
                {state === "error"
                  ? "Something went wrong. Please email us direct at hello@klaxon.studio"
                  : state === "sent"
                    ? "We'll reply within one working day"
                    : "Replies within one working day"}
              </span>
            </div>
          </form>
        </div>
      </section>

      {/* BLACK DIRECT CHANNELS + MAP */}
      <section data-hide-cta="1" className="bg-[var(--brand)] text-white pt-[clamp(48px,6vw,88px)] pb-[clamp(56px,7vw,104px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-white/78 mb-[clamp(24px,3vw,38px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            Talk to us direct
          </span>
          <div className="flex flex-wrap gap-[clamp(28px,3.5vw,56px)] items-stretch">
            <div className="flex-[2] min-w-[260px] self-center flex flex-col gap-[clamp(13px,1.6vw,18px)]">
              {contactRows
                .filter((r) => r.label !== "WhatsApp" && r.label !== "Social" && r.label !== "LinkedIn")
                .map((r) => (
                  <div key={r.label} className="flex flex-col gap-1">
                    <span className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-white/70">
                      {r.label}
                    </span>
                    <a
                      href={r.href}
                      target={r.target}
                      rel="noopener"
                      className="w-fit font-body text-[clamp(15px,1.5vw,16px)] leading-[1.6] text-white no-underline hover:text-[var(--neutral-950)] transition-colors"
                    >
                      {r.value}
                    </a>
                  </div>
                ))}
              <div className="flex items-center gap-[18px] mt-[6px]">
                {(() => {
                  const whatsapp = contactRows.find((r) => r.label === "WhatsApp");
                  const social = contactRows.find((r) => r.label === "Social");
                  const linkedin = contactRows.find((r) => r.label === "LinkedIn");
                  return (
                    <>
                      {whatsapp && (
                        <a
                          href={whatsapp.href}
                          target={whatsapp.target}
                          rel="noopener"
                          aria-label="WhatsApp"
                          className="inline-flex items-center justify-center text-white hover:text-[var(--neutral-950)] transition-colors"
                        >
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                            <path d="M21 11.5a8.5 8.5 0 0 1-12.36 7.58L3 21l2.02-5.4A8.5 8.5 0 1 1 21 11.5Z" />
                            <path d="M8.5 9.5c0 3.5 2.5 6 6 6" />
                          </svg>
                        </a>
                      )}
                      {social && (
                        <a
                          href={social.href}
                          target={social.target}
                          rel="noopener"
                          aria-label="Instagram"
                          className="inline-flex items-center justify-center text-white hover:text-[var(--neutral-950)] transition-colors"
                        >
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                            <rect x="3" y="3" width="18" height="18" />
                            <circle cx="12" cy="12" r="4.2" />
                            <circle cx="17" cy="7" r="0.6" fill="currentColor" stroke="none" />
                          </svg>
                        </a>
                      )}
                      {linkedin && (
                        <a
                          href={linkedin.href}
                          target={linkedin.target}
                          rel="noopener"
                          aria-label="LinkedIn"
                          className="inline-flex items-center justify-center text-white hover:text-[var(--neutral-950)] transition-colors"
                        >
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                            <rect x="3" y="3" width="18" height="18" />
                            <line x1="8" y1="10.5" x2="8" y2="16" />
                            <circle cx="8" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
                            <path d="M11.5 16v-5.5" />
                            <path d="M11.5 12.7c0-1.2.9-2.2 2.1-2.2s1.9.9 1.9 2.2V16" />
                          </svg>
                        </a>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="flex-[3] min-w-[300px] relative min-h-[clamp(280px,38vh,420px)] bg-[#1A1A1A] border border-white/25">
              <iframe
                title="Klaxon Studio, Cocoa Studios, The Biscuit Factory, London SE16"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.0270769598383!2d-0.061745100000000004!3d51.494370599999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760391cb13d0cd%3A0xcd73faf859cb8157!2sKlaxon%20Studio!5e0!3m2!1sen!2suk!4v1784115628675!5m2!1sen!2suk"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 w-full h-full border-0 block"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
