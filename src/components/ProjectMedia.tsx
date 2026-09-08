"use client";

import { useRef, useState } from "react";
import ImageSlot from "@/components/ImageSlot";
import { muxThumbnail, muxThumbnailSrcSet } from "@/lib/mux";
import { vimeoThumbnailSrcSet } from "@/lib/vimeo";
import type { Project } from "@/lib/content";

/** Tiles are roughly a third of a 1280px grid on desktop, full width on mobile. */
const TILE_SIZES = "(min-width: 1320px) 420px, (min-width: 800px) 33vw, 100vw";

/**
 * Hover-to-play tile. The video never autoplays.
 *
 * The loop is only mounted once the pointer has actually been over the card,
 * so a cold page load fetches nothing but poster JPEGs. This matters: the
 * grid renders every project at once and Mux only publishes the `highest`
 * rendition, so eagerly mounting the videos pulled tens of megabytes on a
 * page most visitors only scroll. Touch devices never hover, so they now
 * stay on the posters instead of downloading every loop.
 *
 * Once activated the video stays mounted and is paused and rewound on leave,
 * so a second hover replays instantly rather than refetching.
 */
export default function ProjectMedia({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activated, setActivated] = useState(false);

  const poster = project.video ? muxThumbnail(project.video, 960) : project.vimeoThumb;
  const srcSet = project.video ? muxThumbnailSrcSet(project.video) : vimeoThumbnailSrcSet(project.vimeoThumb);

  if (!poster) return <ImageSlot />;

  return (
    <div
      className="contents"
      onMouseEnter={() => {
        if (!project.video) return;
        // First hover mounts the video, which autoplays on mount. Later
        // hovers hit the ref directly.
        setActivated(true);
        videoRef.current?.play().catch(() => {});
      }}
      onMouseLeave={() => {
        const v = videoRef.current;
        if (v) {
          v.pause();
          v.currentTime = 0.1;
        }
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        srcSet={srcSet}
        sizes={srcSet ? TILE_SIZES : undefined}
        alt={project.client}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {activated && project.video && (
        <video
          ref={videoRef}
          src={project.video}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}
