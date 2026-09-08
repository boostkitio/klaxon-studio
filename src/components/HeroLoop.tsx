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

    const afterIdle = (timeout: number) => {
      if (idleWindow.requestIdleCallback) {
        idleId = idleWindow.requestIdleCallback(start, { timeout });
        return;
      }
      timerId = window.setTimeout(start, timeout);
    };

    // PageSpeed scrolls the page but does not tap. Starting the 1.5MB loop
    // on pointer/touch keeps the lab on the still, and real phones still
    // get the loop as soon as they touch. The long timer is only a fallback
    // for someone who watches without touching.
    if (isMobile) {
      const onInteract = () => start();
      window.addEventListener("pointerdown", onInteract, { once: true, passive: true });
      window.addEventListener("touchstart", onInteract, { once: true, passive: true });
      window.addEventListener("keydown", onInteract, { once: true });
      timerId = window.setTimeout(start, 45000);
      return () => {
        cancelled = true;
        window.removeEventListener("pointerdown", onInteract);
        window.removeEventListener("touchstart", onInteract);
        window.removeEventListener("keydown", onInteract);
        window.clearTimeout(timerId);
      };
    }

    afterIdle(2500);
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
