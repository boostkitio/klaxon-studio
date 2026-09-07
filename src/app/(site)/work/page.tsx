"use client";

import { useState } from "react";
import Link from "next/link";
import Label from "@/components/ui/Label";
import ProjectMedia from "@/components/ProjectMedia";
import FaqAccordion from "@/components/FaqAccordion";
import { HighlightWipe } from "@/components/ScrollHighlight";
import { workAll, filterNames, workFaqItems } from "@/lib/content";

import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";
export default function WorkPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? workAll : workAll.filter((w) => w.cat.includes(filter));

  return (
    <main>
      <JsonLd
        data={[
          faqPageSchema(workFaqItems),
          breadcrumbSchema([{ name: "Work", path: "/work" }]),
        ]}
      />
      <section className="bg-[var(--brand)] text-white pt-[clamp(64px,8vw,112px)] pb-[clamp(32px,4vw,48px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] border-b border-white/16 pb-[clamp(28px,3.4vw,40px)]">
          <div
            className="grid gap-[clamp(32px,4vw,64px)] items-start"
            style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}
          >
            <div>
              <div className="mb-[clamp(20px,3vw,28px)] text-white/80">
                <Label tone="on-brand">Selected work</Label>
              </div>
              <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[0.98] tracking-[-0.04em] text-white">
                Films{" "}
                <HighlightWipe from="#fff" to="var(--brand)" trigger="page">
                  worth watching.
                </HighlightWipe>
              </h1>
              <div className="flex flex-wrap gap-2 mt-[clamp(24px,3vw,34px)]">
                {filterNames.map((f) => {
                  const active = filter === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className="px-[14px] py-[8px] font-mono font-medium text-[11px] tracking-[0.1em] uppercase cursor-pointer transition-colors"
                      style={
                        active
                          ? { background: "#fff", color: "#1A1A1A", border: "1px solid #fff" }
                          : { background: "transparent", color: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.3)" }
                      }
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="text-[clamp(14px,1.3vw,15px)] leading-[1.6] text-white/85 max-w-[50ch]">
              This is a working selection, not the whole story. Every client relationship looks different, and some
              of our best work exists under an NDA rather than on this page. What you&apos;ll find here though spans
              automotive launches, branded content for retail and consumer brands, sports documentary, and corporate
              film for organisations who need something more considered than a standard company video. Filter by
              type below, or get in touch if you want to see something specific to your sector.
            </p>
          </div>
        </div>
      </section>

      <section className="pt-[clamp(36px,4.5vw,56px)] pb-[clamp(72px,10vw,120px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <div className="grid gap-[clamp(8px,1vw,14px)]" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(380px,1fr))" }}>
            {filtered.map((p) => (
              <Link key={p.id} href={p.href} className="group relative aspect-video overflow-hidden bg-[#1A1A1A] cursor-pointer">
                <ProjectMedia project={p} />
                <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/72 to-transparent pointer-events-none" />
                <div className="absolute inset-0 z-[3] bg-white opacity-0 group-hover:opacity-85 transition-opacity duration-200 pointer-events-none" />
                <div className="absolute left-0 right-0 bottom-0 z-10 p-[clamp(18px,2vw,26px)] pointer-events-none">
                  <span className="block font-mono font-medium text-[10px] tracking-[0.12em] uppercase text-white group-hover:text-[var(--brand)] transition-colors mb-[6px]">
                    {p.title}, {p.sector}
                  </span>
                  <span className="block font-display font-[var(--kx-dw,700)] text-[19px] leading-[1.12] tracking-[-0.01em] text-white group-hover:text-[var(--brand)] transition-colors">
                    {p.client}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section data-faq-end="1" className="bg-[var(--brand)] text-white pt-[clamp(56px,7vw,96px)] pb-[clamp(64px,8vw,112px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-white mb-[clamp(24px,3vw,38px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            Work FAQs
          </span>
          <FaqAccordion items={workFaqItems} />
        </div>
      </section>
    </main>
  );
}
