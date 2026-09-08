"use client";

import { useEffect, useState } from "react";
import { HERO_POSTER_WIDTH, muxThumbnail } from "@/lib/mux";

type NavigatorConnection = { saveData?: boolean };

/**
 * Desktop-only hero loop. The still is a separate server image so phones
 * never download the 3.5–4 MB Mux MP4, and LCP is not this video.
 */
export default function HeroLoop({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const poster = muxThumbnail(src, HERO_POSTER_WIDTH);
  const [playLoop, setPlayLoop] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hoverNone = window.matchMedia("(hover: none)");
    const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
    if (motion.matches || hoverNone.matches || connection?.saveData || window.innerWidth < 768) {
      return;
    }

    const start = () => setPlayLoop(true);
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
  }, []);

  if (!playLoop) return null;

  return (
    <video
      src={src}
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
