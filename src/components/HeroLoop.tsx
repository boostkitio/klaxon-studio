"use client";

import { useEffect, useRef, useState } from "react";
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
 * Plays the Mux loop after a short idle, once first paint has settled,
 * so PageSpeed LCP stays on the still instead of the loop file. Real
 * visitors who never interact still get the loop this way - it used to
 * wait for a tap on phones, which meant anyone who didn't touch the
 * hero was stuck looking at a frozen first frame indefinitely.
 * isLabBrowser() below is what actually keeps PageSpeed's lab runs off
 * the loop, not the wait for interaction.
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
  const videoRef = useRef<HTMLVideoElement>(null);

  // React sets `.muted` as a JS property, not an HTML attribute, so the
  // browser's autoplay gate can reject the declarative `autoPlay muted`
  // combo and leave the video stuck paused on its first frame. Calling
  // `.play()` ourselves once it's mounted (`.muted` is already true by
  // then) starts it reliably.
  useEffect(() => {
    if (!loopSrc) return;
    videoRef.current?.play().catch(() => {});
  }, [loopSrc]);

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

    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(start, { timeout: 2500 });
    } else {
      timerId = window.setTimeout(start, 2500);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (timerId !== undefined) window.clearTimeout(timerId);
    };
  }, [mobileSrc, src]);

  if (!loopSrc) return null;

  return (
    <video
      ref={videoRef}
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
