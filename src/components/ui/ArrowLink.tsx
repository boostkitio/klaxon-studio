import Link from "next/link";

export default function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-[10px] font-mono font-medium text-[12px] tracking-[0.12em] uppercase hover:text-[var(--coral-700)] transition-colors ${className}`}
    >
      {children}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="square"
        className="transition-transform duration-150 group-hover:translate-x-1"
      >
        <path d="M4 12h15" />
        <path d="M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
