"use client";

import { useEffect, useRef, useState } from "react";

function clamp01(n: number) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/**
 * Drives the source's two scroll-highlight mechanics:
 *  - trigger="page": progress = how far you've scrolled from the top of
 *    the page (0 to 15% of viewport height). Used once per page, near a
 *    hero/top heading (the original `highlightRef` / `workHlRef`).
 *  - trigger="element" (default): progress = how far this element has
 *    scrolled into view (72% down the viewport, over a 32%-of-viewport
 *    band). Used for headings further down the page (`data-hl-scroll`).
 */
function useHighlightProgress(trigger: "page" | "element") {
  const ref = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  // Driven by scroll/resize rather than a self-perpetuating rAF loop. The
  // loop measured (and for trigger="element", forced layout via
  // getBoundingClientRect) on every frame for the life of the page, whether
  // or not anything had moved.
  useEffect(() => {
    let raf = 0;
    let queued = false;

    const measure = () => {
      queued = false;
      const vh = window.innerHeight || 800;
      let next: number;
      if (trigger === "page") {
        const y = window.scrollY || window.pageYOffset || 0;
        next = clamp01(y / (vh * 0.08));
      } else if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        next = clamp01((vh * 0.92 - rect.top) / (vh * 0.42));
      } else {
        return;
      }
      // Bail out of the re-render when the value has not meaningfully moved.
      setProgress((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(raf);
    };
  }, [trigger]);

  return { ref, progress };
}

/** A coral (or custom) highlighter box that sweeps in behind static-coloured text. */
export function HighlightSweep({
  children,
  bg = "var(--brand)",
  color,
  trigger = "element",
  className = "",
}: {
  children: string;
  bg?: string;
  color: string;
  trigger?: "page" | "element";
  className?: string;
}) {
  const { ref, progress } = useHighlightProgress(trigger);
  return (
    <span
      ref={ref}
      className={className}
      style={{
        backgroundImage: `linear-gradient(${bg},${bg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "0 50%",
        backgroundSize: `${(progress * 100).toFixed(1)}% 1em`,
        padding: "0 0.04em",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
        color,
      }}
    >
      {children}
    </span>
  );
}

/** A left-to-right colour wipe: `from`-coloured text is progressively replaced by `to`-coloured text.
 *  Optionally sweeps a solid `bg` highlighter box in behind the base text at the same time. */
export function HighlightWipe({
  children,
  from,
  to,
  bg,
  trigger = "element",
  className = "",
}: {
  children: string;
  from: string;
  to: string;
  bg?: string;
  trigger?: "page" | "element";
  className?: string;
}) {
  const { ref, progress } = useHighlightProgress(trigger);
  const pct = `${(progress * 100).toFixed(2)}%`;
  // The `to`-coloured copy that wipes across is drawn by the .hl-wipe::after
  // rule in globals.css from data-text, not a second span. A duplicate span
  // put every word in the HTML twice ("ambitious brands. ambitious brands."),
  // which is what search engines and copy-paste saw.
  return (
    <span
      ref={ref}
      data-text={children}
      className={`hl-wipe relative inline-block lg:whitespace-nowrap align-baseline ${className}`}
      style={
        {
          "--hl-pct": pct,
          "--hl-to": to,
          "--hl-pad": bg ? "0.04em 0 0.04em 0" : "0.08em 0 0.18em",
        } as React.CSSProperties
      }
    >
      <span
        style={{
          display: "inline-block",
          padding: bg ? "0.04em 0.22em 0.04em 0" : "0.08em 0 0.18em",
          color: from,
          backgroundImage: `linear-gradient(${bg ?? from},${bg ?? from})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 0",
          backgroundSize: `${pct} 100%`,
        }}
      >
        {children}
      </span>
    </span>
  );
}
