"use client";

import { useEffect, useState } from "react";
import { heroPosterHref } from "@/lib/mux";

type NavigatorConnection = { saveData?: boolean; effectiveType?: string };

/**
 * Desktop plays the Mux loop after a short idle. Phones play the 480p
 * Mux file from the same mobile upload after load, so first paint stays
 * on the still.
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
  const poster = heroPosterHref(loopSrc ?? mobileSrc ?? src);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
    if (motion.matches || connection?.saveData) return;
    if (connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g") return;
    if (navigator.webdriver) return;

    const isMobile = window.innerWidth < 768;
    const nextSrc = isMobile ? mobileSrc : src;
    if (!nextSrc) return;

    let cancelled = false;
    const start = () => {
      if (!cancelled) setLoopSrc(nextSrc);
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const afterIdle = (timeout: number) => {
      if (idleWindow.requestIdleCallback) {
        const id = idleWindow.requestIdleCallback(start, { timeout });
        return () => idleWindow.cancelIdleCallback?.(id);
      }
      const timer = window.setTimeout(start, 1200);
      return () => window.clearTimeout(timer);
    };

    if (!isMobile) return afterIdle(2500);
    if (document.readyState === "complete") return afterIdle(2500);

    const onLoad = () => afterIdle(2500);
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
    };
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
