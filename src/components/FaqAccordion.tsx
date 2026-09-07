"use client";

import { useState } from "react";
import Link from "next/link";
import type { Faq } from "@/lib/content";

/** Renders `a`, turning any `[text](href)` markdown links into real <Link>s. */
function renderAnswer(a: string) {
  const parts = a.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const [, text, href] = match;
    return (
      <Link key={i} href={href} className="underline underline-offset-2 hover:no-underline">
        {text}
      </Link>
    );
  });
}

export default function FaqAccordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState(-1);

  return (
    <div className="w-full flex flex-col border-t border-white/26">
      {items.map((qa, i) => {
        const isOpen = open === i;
        return (
          <div key={qa.q} className="border-b border-white/26 transition-colors" style={{ background: isOpen ? "#ECEBE9" : "transparent" }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className={`w-full flex items-center gap-[clamp(16px,2vw,28px)] py-[clamp(18px,2.2vw,26px)] px-[clamp(12px,1.4vw,18px)] bg-transparent border-0 cursor-pointer text-left transition-colors hover:bg-[#ECEBE9] hover:text-[var(--neutral-950)] ${isOpen ? "text-[var(--neutral-950)]" : ""}`}
            >
              <span className="flex-none w-[6px] h-[6px] rounded-full bg-current" />
              <h3 className="flex-1 min-w-0 font-display font-[var(--kx-dw,700)] text-[clamp(16px,1.62vw,21px)] leading-[1.22] tracking-[-0.015em] m-0 text-[inherit]">
                {qa.q}
              </h3>
              <span
                className="flex-none inline-flex items-center justify-center w-4 h-4 transition-transform duration-300"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square">
                  <path d="M12 4v15" />
                  <path d="M6 13l6 6 6-6" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div>
                <p
                  className="m-0 text-[clamp(14px,1.3vw,15px)] leading-[1.62]"
                  style={{
                    padding: "0 clamp(12px,1.4vw,18px) clamp(22px,2.6vw,30px) calc(6px + clamp(16px,2vw,28px) + clamp(12px,1.4vw,18px))",
                    color: "#1A1A1A",
                  }}
                >
                  {renderAnswer(qa.a)}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
