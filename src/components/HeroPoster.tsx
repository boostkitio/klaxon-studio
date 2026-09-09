import { heroPosterHref } from "@/lib/mux";

/**
 * Decorative hero still, rendered as a CSS background-image rather than
 * an <img>. Note this doesn't take it out of LCP contention - background
 * images set via url() are valid LCP candidates too, and PageSpeed still
 * names this element as LCP. It stays fast because the file is tiny and
 * preloaded with fetchPriority="high" (see the hero page's <link
 * rel="preload">), not because it's excluded from LCP scoring.
 */
export default function HeroPoster({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const poster = heroPosterHref(src);
  if (!poster) return null;

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        backgroundImage: `url(${poster})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
}
