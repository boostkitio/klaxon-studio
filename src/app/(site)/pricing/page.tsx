import Label from "@/components/ui/Label";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import CountUp from "@/components/CountUp";
import { pricingFaqItems } from "@/lib/content";
import { pricingSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";
import { ogFor } from "@/lib/site";

const TITLE = "Video Production Pricing | Klaxon Studio London";

export const metadata = {
  ...ogFor(TITLE, "Honest guidance on video production pricing: day rates, typical project bands and what shapes the cost of a production.", "/pricing"),
  title: { absolute: TITLE },
};

/** Single source of truth for the tiers: rendered below and marked up as
 * Offers, so the SERP price can never drift from the page price. */
const tiers = [
  {
    label: "Starting point",
    price: "£4,500",
    items: ["Single shoot day", "One location", "Small crew", "One edited 1-2 minute film", "Social cutdowns, versioned for your channels"],
  },
  {
    label: "Crew & kit only",
    price: "£2,000",
    items: ["Single shoot day", "Van-load of equipment", "Raw footage handed over at the end of the day"],
  },
];

const costDrivers = [
  { num: "01", title: "Crew size", desc: "A simple interview needs two people. A large commercial might need fifteen or more. Crew size is driven by the brief, and the right crew for the job is always the most efficient one. Under-crewing a shoot tends to cost a project more than the cost saving on the day." },
  { num: "02", title: "Shoot days", desc: "Crew, kit and locations all multiply the cost per day. When we're able to do it in fewer days, we will." },
  { num: "03", title: "Locations", desc: "Your own office costs almost nothing. Studio hires, landmarks and multiple sites add up fast, and Royal Parks, transport and heritage venues are slow and costly to permit." },
  { num: "04", title: "Talent", desc: "Professional actors, presenters and voiceover artists carry casting fees and day rates. Your own people cost less, but they need more valuable time on set and careful direction." },
  { num: "05", title: "Post-production", desc: "Editing, grading, sound design and graphics can be 20–50% of a budget, more with motion graphics. Don't cut here; the audience never sees the shoot, only the finished film." },
  { num: "06", title: "Versioning & delivery", desc: "Cutdowns, social formats, subtitled versions and broadcast masters all add cost. Plan them upfront as it's far cheaper than coming back for extra edits later." },
];

export default function PricingPage() {
  return (
    <main>
      <JsonLd
        data={[
          pricingSchema(tiers),
          faqPageSchema(pricingFaqItems),
          breadcrumbSchema([{ name: "Pricing", path: "/pricing" }]),
        ]}
      />
      <section className="bg-[var(--brand)] text-white pt-[clamp(64px,8vw,112px)] pb-[clamp(40px,5vw,64px)]">
        <div
          className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] grid gap-[clamp(32px,4vw,64px)] items-end"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}
        >
          <div>
            <div className="mb-[clamp(20px,3vw,28px)] text-white/80">
              <Label tone="on-brand">Pricing</Label>
            </div>
            <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[0.98] tracking-[-0.04em] text-white">
              So, what does video production cost<span className="text-white">?</span>
            </h1>
          </div>
          <p className="text-[clamp(14px,1.3vw,15px)] leading-[1.6] text-white/85 max-w-[46ch]">
            Honest pricing for honest briefs. We don&apos;t sell packages. Every brief is different, so every quote
            is built from scratch. But here&apos;s a useful starting point, and what can move the number.
          </p>
        </div>
      </section>

      {/* STARTING POINTS */}
      <section className="pt-[clamp(48px,6vw,88px)] pb-[clamp(28px,3.4vw,52px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(24px,3vw,40px)]">
            {tiers.map((tier) => (
              <div key={tier.label} className="border border-[var(--brand)] bg-white p-[clamp(28px,3.4vw,44px)] flex flex-col gap-[clamp(18px,2.2vw,26px)]">
                <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[var(--text-muted)]">
                  <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
                  {tier.label}
                </span>
                <div className="flex flex-col gap-[6px]">
                  <span className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">From</span>
                  <span className="flex items-baseline gap-[14px] flex-wrap">
                    <span className="font-display font-[var(--kx-dw,700)] text-[clamp(44px,5.6vw,72px)] leading-[0.86] tracking-[-0.045em] text-[var(--text-primary)]">
                      <CountUp value={tier.price} /><span className="text-[var(--brand)]">+</span>
                    </span>
                    <span className="font-mono font-medium text-[11px] tracking-[0.1em] uppercase text-[var(--text-muted)]">exc VAT</span>
                  </span>
                </div>
                <div className="flex flex-col gap-[13px]">
                  {tier.items.map((item) => (
                    <div key={item} className="flex items-start gap-[12px]">
                      <span className="flex-none w-[6px] h-[6px] mt-[0.55em] bg-[var(--brand)]" />
                      <span className="text-[clamp(15px,1.5vw,17px)] leading-[1.5] text-[var(--text-secondary)]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY NO PACKAGES */}
      <section className="pt-[clamp(40px,5vw,72px)] pb-[clamp(56px,7vw,96px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="inline-flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-[clamp(22px,2.6vw,32px)]">
            <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
            Why no packages
          </span>
          <h2 className="m-0 max-w-[24ch] font-display font-[var(--kx-dw,700)] text-[clamp(25px,3.2vw,44px)] leading-[1.08] tracking-[-0.03em] text-[var(--text-primary)]">
            Video production costs vary enormously, which is why we don&apos;t offer fixed package pricing
            <span className="text-[var(--brand)]">.</span>
          </h2>
          <p className="mt-[clamp(22px,2.6vw,32px)] max-w-[52ch] text-[clamp(15px,1.5vw,17px)] leading-[1.6] text-[var(--text-secondary)]">
            We have a call with every client to understand the project&apos;s objectives, timeline and deliverables
            before giving a quote tailored specifically to you.
          </p>
        </div>
      </section>

      {/* WHAT DRIVES THE COST */}
      <section className="bg-[var(--brand)] text-white py-[clamp(64px,8vw,112px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-white/78 mb-[clamp(22px,2.6vw,32px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            What drives the cost
          </span>
          <h2 className="m-0 mb-[clamp(36px,4.4vw,56px)] max-w-[22ch] font-display font-[var(--kx-dw,700)] text-[clamp(25px,3.2vw,44px)] leading-[1.08] tracking-[-0.03em] text-white">
            Six things that move the number<span className="text-white">.</span>
          </h2>
          <div className="grid gap-x-[clamp(32px,4vw,64px)] gap-y-[clamp(30px,3.4vw,52px)]" style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}>
            {costDrivers.map((d) => (
              <div key={d.num} className="flex flex-col gap-[10px] pt-[clamp(18px,2vw,24px)] border-t border-white/28">
                <span className="font-mono font-medium text-[11px] tracking-[0.14em] text-white">{d.num}</span>
                <h3 className="m-0 font-display font-[var(--kx-dw,700)] text-[clamp(18px,1.9vw,23px)] leading-[1.1] tracking-[-0.02em] text-white">
                  {d.title}
                </h3>
                <p className="m-0 text-[clamp(14px,1.32vw,15.5px)] leading-[1.6] text-white/86">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SET A BUDGET */}
      <section className="bg-[#1A1A1A] text-white py-[clamp(64px,8vw,112px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="inline-flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-white/70 mb-[clamp(22px,2.6vw,32px)]">
            <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
            Set a budget
          </span>
          <h2 className="m-0 max-w-[20ch] font-display font-[var(--kx-dw,700)] text-[clamp(28px,3.8vw,52px)] leading-[0.99] tracking-[-0.035em] text-white">
            The most useful thing you can do is share your budget<span className="text-[var(--brand)]">.</span>
          </h2>
          <p className="mt-[clamp(24px,2.8vw,34px)] max-w-[54ch] text-[clamp(15px,1.5vw,17px)] leading-[1.62] text-white/78">
            Even a ballpark figure helps. Tell us the number and we&apos;ll tell you honestly what it can achieve,
            where to prioritise, where to scale back, and whether the brief is realistic. Without it, we&apos;re
            quoting blind, which doesn&apos;t serve anybody.
          </p>
        </div>
      </section>

      {/* PRICING FAQs */}
      <section data-faq-end="1" className="bg-[var(--brand)] text-white pt-[clamp(56px,7vw,96px)] pb-[clamp(64px,8vw,112px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-white mb-[clamp(24px,3vw,38px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            Pricing FAQs
          </span>
          <FaqAccordion items={pricingFaqItems} />
        </div>
      </section>
    </main>
  );
}
