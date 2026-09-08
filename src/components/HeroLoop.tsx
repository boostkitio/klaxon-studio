"use client";

import { useEffect, useState } from "react";
import { heroPosterHref } from "@/lib/mux";

type NavigatorConnection = { saveData?: boolean };

/**
 * Desktop plays `src`. Phones play `mobileSrc` when provided, otherwise
 * they stay on the still so they do not download the desktop MP4.
 */
export default function HeroLoop({
  src,
  mobileSrc,
  className,
}: {
  src: string;
  mobileSrc?: string;
  className?: string;
}) {
  const [loopSrc, setLoopSrc] = useState<string | null>(null);
  const poster = heroPosterHref(loopSrc ?? src);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
    if (motion.matches || connection?.saveData) return;

    const isMobile = window.innerWidth < 768;
    const nextSrc = isMobile ? mobileSrc : src;
    if (!nextSrc) return;

    const start = () => setLoopSrc(nextSrc);
    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(start, { timeout: 2500 });
      return () => idleWindow.cancelIdleCallback?.(id);
    }

    const timeout = window.setTimeout(start, 1200);
    return () => window.clearTimeout(timeout);
  }, [mobileSrc, src]);

  if (!loopSrc) return null;

  return (
    <video
      src={loopSrc}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={className}
    />
  );
}
