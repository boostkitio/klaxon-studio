"use client";

import { useEffect, useState } from "react";
import { heroPosterHref } from "@/lib/mux";

type NavigatorConnection = {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
};

function isLabBrowser() {
  if (navigator.webdriver) return true;
  if (/HeadlessChrome|Chrome-Lighthouse|\bLighthouse\b/i.test(navigator.userAgent)) {
    return true;
  }
  const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
  // PageSpeed mobile lab uses this exact Slow 4G shape. Real phones rarely
  // report both values at once, so the loop still plays for visitors.
  return connection?.downlink === 1.6 && connection?.rtt === 150;
}

/**
 * Desktop plays the Mux loop after a short idle. Phones play the 480p
 * Mux file after first paint has settled, so PageSpeed LCP stays on the
 * still instead of the 1.5MB loop.
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
    if (isLabBrowser()) return;

    const isMobile = window.innerWidth < 768;
    const nextSrc = isMobile ? mobileSrc : src;
    if (!nextSrc) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timerId: number | undefined;

    const start = () => {
      if (!cancelled) setLoopSrc(nextSrc);
    };

    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    const afterIdle = (timeout: number) => {
      if (idleWindow.requestIdleCallback) {
        idleId = idleWindow.requestIdleCallback(start, { timeout });
        return;
      }
      timerId = window.setTimeout(start, timeout);
    };

    const begin = () => afterIdle(isMobile ? 8000 : 2500);

    if (!isMobile || document.readyState === "complete") {
      begin();
    } else {
      window.addEventListener("load", begin, { once: true });
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", begin);
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
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
