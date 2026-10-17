import Image from "next/image";

/**
 * Mirrors the design system's "image-slot" placeholder convention: renders
 * supplied imagery/video when we have it, otherwise the brand's own
 * "IMAGE TO COME" mono placeholder rather than an empty box or mismatched
 * stock photography.
 */
export default function ImageSlot({
  src,
  video,
  alt = "",
  className = "",
  placeholder = "Image to come",
  objectPosition,
  sizes = "100vw",
  preload = false,
}: {
  src?: string;
  video?: string;
  alt?: string;
  className?: string;
  placeholder?: string;
  /** CSS object-position, e.g. "center 20%" — useful for portraits where
   * the subject's face sits in the upper part of a tall source photo
   * being cropped into a wider box. Defaults to center. */
  objectPosition?: string;
  /** Rendered display width for next/image's srcset selection. Grid tiles
   * must pass their real fraction of the viewport ("(min-width: 768px) 25vw,
   * 50vw") — leaving the 100vw default makes desktop browsers download
   * images several times larger than the box they fill. */
  sizes?: string;
  /** Set on the one image that is the page's LCP element (an article hero).
   * Preloads it from the head and loads it eagerly instead of lazily. */
  preload?: boolean;
}) {
  if (video) {
    return (
      <video
        src={video}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover ${className}`}
        style={objectPosition ? { objectPosition } : undefined}
      />
    );
  }

  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        preload={preload}
        className={`object-cover ${className}`}
        style={objectPosition ? { objectPosition } : undefined}
      />
    );
  }

  return (
    <div className={`absolute inset-0 w-full h-full bg-[#1A1A1A] flex items-center justify-center ${className}`}>
      <span className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-white/40">
        {placeholder}
      </span>
    </div>
  );
}
