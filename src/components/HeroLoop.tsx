"use client";

import { useEffect, useState } from "react";
import { muxThumbnail } from "@/lib/mux";

type NavigatorConnection = { saveData?: boolean };

/**
 * Mux is a fast CDN, but these hero assets only publish a 720p MP4
 * (about 3.5–4 MB). Putting that URL on <video src> makes the browser
 * fetch the whole file during first load. The poster is the LCP image;
 * the loop starts after the page is idle, and stays off when the visitor
 * asked for reduced motion or Save-Data.
 */
export default function HeroLoop({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const poster = muxThumbnail(src, 1600);
  const [playLoop, setPlayLoop] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
    if (motion.matches || connection?.saveData) return;

    const start = () => setPlayLoop(true);
    const idleWindow = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (idleWindow.requestIdleCallback) {
      const id = idleWindow.requestIdleCallback(start, { timeout: 1200 });
      return () => idleWindow.cancelIdleCallback?.(id);
    }

    const timeout = window.setTimeout(start, 400);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          fetchPriority="high"
          decoding="async"
          aria-hidden="true"
          className={className}
        />
      )}
      {playLoop && (
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
      )}
    </>
  );
}
