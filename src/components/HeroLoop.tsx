"use client";

import { useEffect, useState } from "react";
import { muxHeroPosterSrcSet, muxThumbnail } from "@/lib/mux";

type NavigatorConnection = { saveData?: boolean };

/**
 * Mux is a fast CDN, but these hero assets only publish a 720p MP4
 * (about 3.5–4 MB). Autoloading that file on a phone is what pushed
 * mobile LCP to 8.1s in PageSpeed: the poster painted, then the video
 * frame replaced it after the download. Phones keep the poster. Desktop
 * starts the loop after idle.
 */
export default function HeroLoop({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const poster = muxThumbnail(src, 1080);
  const posterSrcSet = muxHeroPosterSrcSet(src);
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

  return (
    <>
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          srcSet={posterSrcSet}
          sizes="100vw"
          alt=""
          width={1920}
          height={1080}
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
