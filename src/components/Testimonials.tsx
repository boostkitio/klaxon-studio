"use client";

import { useEffect, useState } from "react";
import { testimonials } from "@/lib/content";

const themes = [
  { bg: "#E4E2DE", text: "#1A1A1A", sub: "#4A4843", ctrl: "#1A1A1A", ctrlIdle: "rgba(26,26,26,0.45)" },
  { bg: "#1A1A1A", text: "#FFFFFF", sub: "#C9C6C0", ctrl: "#FFFFFF", ctrlIdle: "rgba(255,255,255,0.55)" },
];

const count = testimonials.length;
// A clone of the last slide up front and the first slide at the end lets the
// track keep sliding in one direction past the real ends; once the transition
// lands on a clone we snap (transition-free) to the matching real slide, so
// the loop reads as continuous instead of rubber-banding back to slide 0.
const slides = [testimonials[count - 1], ...testimonials, testimonials[0]];

export default function Testimonials() {
  const [index, setIndex] = useState(1);
  const [animate, setAnimate] = useState(true);
  const realIndex = ((index - 1) % count + count) % count;
  const theme = themes[realIndex % themes.length];

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimate(true);
      setIndex((i) => i + 1);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (index >= 1 && index <= count) return;
    const t = setTimeout(() => {
      setAnimate(false);
      setIndex(((index - 1) % count + count) % count + 1);
    }, 520);
    return () => clearTimeout(t);
  }, [index]);

  useEffect(() => {
    if (animate) return;
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  const step = (delta: number) => {
    setAnimate(true);
    setIndex((i) => i + delta);
  };
  const goto = (i: number) => {
    setAnimate(true);
    setIndex(i + 1);
  };

  return (
    <section className="relative overflow-hidden">
      <div
        className={`flex w-full ${animate ? "transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]" : ""}`}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((t, i) => {
          const realI = ((i - 1) % count + count) % count;
          const th = themes[realI % themes.length];
          return (
            <div
              key={i}
              className="flex-none w-full box-border pt-[clamp(36px,5.5vw,72px)] px-[clamp(20px,5vw,48px)] pb-[clamp(52px,7.5vw,96px)]"
              style={{ background: th.bg }}
            >
              <div className="max-w-[1080px] mx-auto">
                <span
                  className="inline-flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase mb-[clamp(22px,2.8vw,36px)]"
                  style={{ color: th.sub }}
                >
                  <span className="w-[4px] h-[1em]" style={{ background: th.text }} />
                  What they say
                </span>
                <p
                  className="m-0 font-display font-[var(--kx-dw,700)] text-[clamp(23px,2.7vw,34px)] leading-[1.12] tracking-[-0.03em]"
                  style={{ color: th.text, textWrap: "balance" }}
                >
                  {t.quote}
                </p>
                <div className="flex flex-col gap-[5px] mt-[clamp(26px,3.2vw,42px)]">
                  <span className="font-mono font-medium text-[11px] tracking-[0.12em] uppercase" style={{ color: th.text }}>
                    {t.name}
                  </span>
                  <span className="font-mono font-medium text-[11px] tracking-[0.12em] uppercase" style={{ color: th.sub }}>
                    {t.role}
                  </span>
                  <span className="font-mono font-medium text-[11px] tracking-[0.12em] uppercase" style={{ color: th.sub }}>
                    {t.source}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute left-0 right-0 bottom-[clamp(28px,4vw,48px)] z-10 max-w-[1080px] mx-auto px-[clamp(20px,5vw,48px)] flex items-center gap-5">
        <div className="flex gap-[10px]">
          <button
            aria-label="Previous review"
            onClick={() => step(-1)}
            className="w-[46px] h-[46px] inline-flex items-center justify-center border cursor-pointer transition-colors"
            style={{ borderColor: theme.ctrlIdle, color: theme.ctrl }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square">
              <path d="M20 12H5" />
              <path d="M11 6l-6 6 6 6" />
            </svg>
          </button>
          <button
            aria-label="Next review"
            onClick={() => step(1)}
            className="w-[46px] h-[46px] inline-flex items-center justify-center border cursor-pointer transition-colors"
            style={{ borderColor: theme.ctrlIdle, color: theme.ctrl }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square">
              <path d="M4 12h15" />
              <path d="M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to review ${i + 1}`}
              onClick={() => goto(i)}
              className="min-w-6 min-h-6 p-0 border-0 bg-transparent cursor-pointer inline-flex items-center justify-center"
            >
              <span
                className="block h-[7px] transition-all duration-200"
                style={{
                  width: i === realIndex ? 28 : 7,
                  background: i === realIndex ? theme.ctrl : theme.ctrlIdle,
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
