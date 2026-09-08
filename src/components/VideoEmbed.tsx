"use client";

import { useState } from "react";

/**
 * Click-to-load Vimeo facade.
 *
 * Embedding the player directly makes it the LCP element on every case study
 * and pulls the whole Vimeo player bundle on load, which measured a 10.3s LCP
 * on a page weighing only 1.4MB. The poster paints immediately and the iframe
 * is only created on click, at which point autoplay carries straight into
 * playback so the extra click costs the visitor nothing.
 */
export default function VideoEmbed({
  src,
  poster,
  title,
  priority = true,
}: {
  src: string;
  poster?: string;
  title: string;
  priority?: boolean;
}) {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={`${src}&autoplay=1`}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        title={title}
        className="absolute inset-0 w-full h-full border-none"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={`Play video: ${title}`}
      className="group absolute inset-0 w-full h-full p-0 border-none bg-[#1A1A1A] cursor-pointer overflow-hidden"
    >
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={poster}
          alt=""
          fetchPriority={priority ? "high" : "auto"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <span className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors" />
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-[clamp(58px,7vw,84px)] h-[clamp(58px,7vw,84px)] bg-[var(--brand)] group-hover:scale-105 transition-transform">
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="#fff"
          aria-hidden="true"
          className="translate-x-[2px]"
        >
          <path d="M6 3.5v17l15-8.5z" />
        </svg>
      </span>
    </button>
  );
}
