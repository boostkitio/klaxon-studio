"use client";

import { useState } from "react";
import Link from "next/link";
import Label from "@/components/ui/Label";
import ImageSlot from "@/components/ImageSlot";
import FaqAccordion from "@/components/FaqAccordion";
import { services, contentTypes, servicesFaqItems, type ServiceDetail } from "@/lib/content";

import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
function CtaTile({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group relative aspect-square overflow-hidden bg-[var(--brand)] flex flex-col justify-end p-[clamp(13px,1.5vw,17px)]"
    >
      <span className="font-display font-bold text-[clamp(18px,1.9vw,23px)] leading-[1.15] tracking-[-0.025em] text-white">
        {label}
      </span>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
        className="absolute top-[clamp(13px,1.5vw,17px)] right-[clamp(13px,1.5vw,17px)] text-white transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
      >
        <path d="M7 17L17 7" />
        <path d="M8 7h9v9" />
      </svg>
    </Link>
  );
}

function ServiceTileGrid({ items, trailingTile }: { items: ServiceDetail[]; trailingTile?: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const first = items.slice(0, 4);
  const extra = items.slice(4);

  const Tile = ({ s }: { s: ServiceDetail }) => (
    <Link
      key={s.slug}
      href={s.href}
      className="group relative aspect-square overflow-hidden bg-[#1A1A1A] block"
    >
      <ImageSlot src={`/${s.img}`} alt={s.title} objectPosition={s.imgPosition} sizes="(min-width: 768px) 25vw, 50vw" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/74 to-black/12 pointer-events-none" />
      <div className="absolute inset-0 z-[2] bg-[var(--brand)] opacity-0 group-hover:opacity-86 transition-opacity duration-200 pointer-events-none" />
      <div className="absolute inset-0 z-[3] p-[clamp(13px,1.5vw,17px)] flex flex-col justify-end text-left">
        <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] opacity-0 group-hover:opacity-100 transition-all duration-300 overflow-hidden">
          <p className="overflow-hidden m-0 mb-[9px] text-[14px] leading-[1.45] text-white">{s.desc}</p>
        </div>
        <span className="font-display font-bold text-[clamp(18px,1.9vw,23px)] leading-[1.12] tracking-[-0.025em] text-white">
          {s.title}
        </span>
      </div>
    </Link>
  );

  return (
    <>
      <div className="grid grid-cols-4 gap-[10px] mt-[clamp(20px,2.4vw,28px)] max-md:grid-cols-2">
        {first.map((s) => (
          <Tile key={s.slug} s={s} />
        ))}
      </div>
      {extra.length > 0 && (
        <>
          <div
            className="grid transition-[grid-template-rows] duration-500"
            style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <div className="grid grid-cols-4 gap-[10px] pt-[10px] max-md:grid-cols-2">
                {extra.map((s) => (
                  <Tile key={s.slug} s={s} />
                ))}
                {trailingTile}
              </div>
            </div>
          </div>
          <div className="mt-[clamp(20px,2.4vw,28px)]">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center justify-center gap-[10px] px-[22px] py-[13px] bg-transparent text-[var(--brand)] border border-[var(--brand)] font-mono font-medium text-[12px] tracking-[0.12em] uppercase whitespace-nowrap cursor-pointer transition-colors hover:bg-[var(--brand)] hover:text-white"
            >
              {expanded ? "See less" : "See more"}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="square"
                style={{ transform: expanded ? "rotate(-90deg)" : "rotate(90deg)", transition: "transform .2s" }}
              >
                <path d="M4 12h15" />
                <path d="M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default function ServicesPage() {
  return (
    <main>
      <JsonLd
        data={[
          faqPageSchema(servicesFaqItems),
          breadcrumbSchema([{ name: "Services", path: "/services" }]),
        ]}
      />
      <section className="bg-[var(--brand)] text-white pt-[clamp(64px,8vw,112px)] pb-[clamp(40px,5vw,64px)]">
        <div
          className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] grid gap-[clamp(32px,4vw,64px)] items-end"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}
        >
          <div>
            <div className="mb-[clamp(20px,3vw,28px)] text-white/80">
              <Label tone="on-brand">Services &amp; skills</Label>
            </div>
            <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[0.98] tracking-[-0.04em] text-white">
              Everything, or just the bit you need<span className="text-white">.</span>
            </h1>
          </div>
          <p className="text-[clamp(14px,1.3vw,15px)] leading-[1.6] text-white/85 max-w-[46ch]">
            From the first idea to the final deliverable, we do it all. End-to-end or just the bit you need, we fit
            around you, not the other way around. Either way, we&apos;re in. Take a look at what we offer, or just
            get in touch. We&apos;re good at figuring out what a project needs.
          </p>
        </div>
      </section>

      <section className="pt-[clamp(28px,3.5vw,48px)] pb-[clamp(56px,7vw,88px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <h2 className="font-mono font-medium text-[11px] tracking-[0.1em] uppercase text-[var(--text-muted)] m-0">
            Production
          </h2>
          <p className="mt-[clamp(12px,1.4vw,16px)] mb-0 text-[clamp(14px,1.32vw,15.5px)] leading-[1.62] text-[var(--text-secondary)]">
            Every film starts long before the camera rolls, and doesn&apos;t end when it stops. This is the full
            production process, the parts you see and the parts you don&apos;t. Whether you need one stage or all of
            them, we bring the same level of care to each. Some clients want us end to end. Others just need a gap
            filled, a crew for a day, an edit tightened, a grade finished properly. Either way, we slot in where you
            need us.
          </p>
          <ServiceTileGrid items={services} />
        </div>
      </section>

      <section className="pb-[clamp(72px,10vw,120px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <h2 className="font-mono font-medium text-[11px] tracking-[0.1em] uppercase text-[var(--text-muted)] m-0">
            Content
          </h2>
          <p className="mt-[clamp(12px,1.4vw,16px)] mb-0 text-[clamp(14px,1.32vw,15.5px)] leading-[1.62] text-[var(--text-secondary)]">
            Different audiences need different formats, and we work in a lot of them. From a 30-second social ad to a
            long-form documentary, the discipline is the same: know what the film needs to do, then make sure it does
            it. We work across branded content, corporate video, B2B, documentary, sport and automotive. The brief can
            change, but our standard won&apos;t.
          </p>
          <ServiceTileGrid items={contentTypes} trailingTile={<CtaTile href="/work" label="See all our work" />} />
        </div>
      </section>

      <section data-faq-end="1" className="bg-[var(--brand)] text-white pt-[clamp(56px,7vw,96px)] pb-[clamp(64px,8vw,112px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-white mb-[clamp(24px,3vw,38px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            Services FAQs
          </span>
          <FaqAccordion items={servicesFaqItems} />
        </div>
      </section>
    </main>
  );
}
