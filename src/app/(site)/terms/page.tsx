import { termsData } from "@/lib/content";
import { ogFor } from "@/lib/site";

export const metadata = ogFor(
  "Terms of Engagement",
  "Klaxon Studio terms of engagement for video production: quotes and orders, shoot days and overtime, delivery, payment, cancellation and copyright.",
  "/terms"
);

export default function TermsPage() {
  return (
    <main>
      <section className="bg-[var(--brand)] text-white pt-[clamp(72px,9vw,128px)] pb-[clamp(56px,7vw,96px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="inline-flex items-center gap-[11px] font-mono font-medium text-[12px] tracking-[0.12em] uppercase text-white mb-[clamp(28px,4vw,44px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            Terms of Engagement
          </span>
          <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[0.98] tracking-[-0.04em] max-w-[20ch] text-white">
            It&apos;s boring but important; both for you and us
          </h1>
          <span className="block mt-[clamp(28px,3.4vw,42px)] font-mono font-medium text-[11px] tracking-[0.14em] uppercase text-white/82">
            {termsData.updated}
          </span>
        </div>
      </section>
      <section className="pt-[clamp(56px,7vw,104px)] pb-[clamp(72px,10vw,120px)]">
        <div className="max-w-[920px] mx-auto px-[clamp(20px,5vw,48px)] flex flex-col gap-[clamp(44px,5vw,72px)]">
          {termsData.sections.map((sec) => (
            <div key={sec.heading} className="flex flex-col gap-[clamp(14px,1.6vw,18px)]">
              <h2 className="font-display font-[var(--kx-dw,700)] text-[clamp(20px,2.2vw,28px)] leading-[1.1] tracking-[-0.025em] m-0 mb-1 pb-[clamp(14px,1.6vw,18px)] border-b border-[var(--border-subtle)]">
                {sec.heading}
              </h2>
              {sec.items.map((clause, i) => (
                <p key={i} className="m-0 text-[clamp(14px,1.32vw,15.5px)] leading-[1.68] text-[var(--text-secondary)]">
                  {clause}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
