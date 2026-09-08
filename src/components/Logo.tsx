import Image from "next/image";

const sources = {
  coral: "/images/klxn-coral.png",
  white: "/images/klxn-white.png",
  ink: "/images/klxn-ink.png",
};

export default function Logo({
  variant = "coral",
  height = 64,
  className = "",
  priority = true,
}: {
  variant?: keyof typeof sources;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const ratio = 1600 / 583;
  return (
    <Image
      src={sources[variant]}
      alt="Klaxon Studio"
      height={height}
      width={Math.round(height * ratio)}
      className={className || undefined}
      priority={priority}
    />
  );
}
