import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost-light" | "ghost-dark" | "ghost-brand" | "light";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[var(--brand)] text-white border border-[var(--brand)] hover:bg-white hover:text-[var(--brand)] hover:border-[var(--brand)]",
  "ghost-light":
    "bg-transparent text-white border border-white hover:bg-white hover:text-[var(--brand)]",
  "ghost-dark":
    "bg-transparent text-[var(--text-primary)] border border-[var(--border-strong)] hover:bg-[var(--brand)] hover:text-[var(--neutral-950)] hover:border-[var(--brand)]",
  "ghost-brand":
    "bg-transparent text-[var(--brand)] border border-[var(--brand)] hover:bg-[var(--brand)] hover:text-white hover:border-[var(--brand)]",
  light:
    "bg-white text-[var(--brand)] border border-white hover:bg-[var(--brand)] hover:text-white hover:border-[var(--brand)]",
};

const baseClasses =
  "inline-flex items-center justify-center gap-[10px] px-[22px] py-[13px] font-mono font-medium text-[12px] tracking-[0.12em] uppercase cursor-pointer transition-colors duration-150 whitespace-nowrap";

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square">
    <path d="M4 12h15" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);

interface CommonProps {
  children: ReactNode;
  variant?: Variant;
  icon?: boolean;
  className?: string;
}

export function Button({
  children,
  variant = "primary",
  icon = true,
  className = "",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
      {icon && <ArrowIcon />}
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  icon = true,
  className = "",
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
      {icon && <ArrowIcon />}
    </Link>
  );
}
