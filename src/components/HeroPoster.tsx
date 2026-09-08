import { heroPosterHref } from "@/lib/mux";

/**
 * Decorative hero still. A full-viewport <img> is LCP even when it is
 * aria-hidden, which is why PageSpeed stayed at 7s after the file itself
 * downloaded in a few hundred milliseconds. CSS background-image is not
 * an LCP candidate, so the heading that already paints at ~1s can be LCP.
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
