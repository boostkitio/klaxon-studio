import Image from "next/image";
import { susData } from "@/lib/content";
import { ogFor } from "@/lib/site";

export const metadata = ogFor("Sustainability", "How Klaxon Studio approaches sustainable video production, from travel and energy through to waste and our environmental policy.", "/sustainability");

export default function SustainabilityPage() {
  return (
    <main>
      <section className="bg-[var(--brand)] text-white pt-[clamp(72px,9vw,128px)] pb-[clamp(64px,8vw,112px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="inline-flex items-center gap-[11px] font-mono font-medium text-[12px] tracking-[0.12em] uppercase text-white mb-[clamp(28px,4vw,44px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            Sustainability
          </span>
          <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[0.96] tracking-[-0.04em] max-w-[18ch] text-white">
            {susData.lead}
          </h1>
        </div>
      </section>

      <section className="pt-[clamp(56px,7vw,104px)] pb-[clamp(64px,8vw,96px)]">
        <div
          className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] grid gap-[clamp(40px,5vw,72px)] items-start"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}
        >
          <div className="flex flex-col gap-[clamp(22px,2.6vw,30px)]">
            {susData.body.map((para, i) => (
              <p key={i} className="text-[clamp(15px,1.5vw,17px)] leading-[1.68] text-[var(--text-secondary)]">
                {para}
              </p>
            ))}
          </div>
          <div className="relative aspect-[4/3] min-h-[260px] overflow-hidden bg-[#1A1A1A]">
            <Image
              src="/uploads/41954deb-f491-4655-b529-834da25e74f0 2-ed73c898.webp"
              alt="Sustainability"
              fill
              sizes="50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="pb-[clamp(64px,8vw,96px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-[clamp(20px,2.6vw,28px)]">
            <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
            Policy aims
          </span>
          <div
            className="grid gap-px bg-[var(--border-subtle)] border border-[var(--border-subtle)]"
            style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}
          >
            {susData.aims.map((aim) => (
              <div key={aim} className="bg-white p-[clamp(20px,2.4vw,26px)]">
                <p className="m-0 text-[clamp(14px,1.32vw,15.5px)] leading-[1.56] text-[var(--text-secondary)]">{aim}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-[clamp(72px,10vw,120px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-[clamp(24px,3vw,34px)]">
            <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
            Where it applies
          </span>
          <div className="border-t border-[var(--border-subtle)]">
            {susData.pillars.map((pillar) => (
              <div
                key={pillar.num}
                className="grid grid-cols-1 sm:grid-cols-[minmax(140px,240px)_1fr] gap-[clamp(16px,3vw,48px)] py-[clamp(28px,3.4vw,40px)] border-b border-[var(--border-subtle)]"
              >
                <div className="flex items-baseline gap-[12px]">
                  <span className="font-mono font-medium text-[12px] tracking-[0.08em] text-[var(--brand)]">{pillar.num}</span>
                  <h2 className="font-display font-[var(--kx-dw,700)] text-[clamp(19px,1.9vw,24px)] leading-[1.14] tracking-[-0.02em] m-0">
                    {pillar.title}
                  </h2>
                </div>
                <ul className="m-0 p-0 list-none flex flex-col gap-[10px] max-w-[64ch]">
                  {pillar.points.map((pt) => (
                    <li key={pt} className="flex gap-[10px] text-[clamp(14px,1.32vw,15.5px)] leading-[1.6] text-[var(--text-secondary)]">
                      <span className="text-[var(--brand)] flex-shrink-0">–</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-[clamp(40px,5vw,56px)] flex flex-wrap items-center gap-5 justify-between">
            <p className="m-0 max-w-[44ch] text-[clamp(14px,1.32vw,15.5px)] leading-[1.6] text-[var(--text-secondary)]">
              Read the policy in full, including how we monitor and review it.
            </p>
            <a
              href="/assets/Klaxon-Studio-Environmental-Policy.pdf"
              download="Klaxon-Studio-Environmental-Policy.pdf"
              className="inline-flex items-center justify-center gap-[10px] px-[26px] py-[15px] bg-[var(--brand)] text-white border border-[var(--brand)] font-mono font-medium text-[12px] tracking-[0.1em] uppercase no-underline whitespace-nowrap transition-colors hover:bg-[#DA3F30]"
            >
              Download Environmental Policy
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
