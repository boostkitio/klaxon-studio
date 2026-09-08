import { HERO_POSTER_WIDTH, muxHeroPosterSrcSet, muxThumbnail } from "@/lib/mux";

/**
 * Server-rendered LCP image. Kept out of the client hero loop so the
 * poster is in the first HTML and does not wait on hydration.
 */
export default function HeroPoster({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const poster = muxThumbnail(src, HERO_POSTER_WIDTH);
  if (!poster) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={poster}
      srcSet={muxHeroPosterSrcSet(src)}
      sizes="100vw"
      alt=""
      width={1920}
      height={1080}
      fetchPriority="high"
      loading="eager"
      decoding="sync"
      aria-hidden="true"
      className={className}
    />
  );
}
