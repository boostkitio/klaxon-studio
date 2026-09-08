export default function Tag({
  children,
  active = false,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  const classes = active
    ? "bg-[var(--brand)] text-[var(--neutral-950)] border-[var(--brand)]"
    : "bg-transparent text-[var(--text-secondary)] border-[var(--border-subtle)] hover:border-[var(--neutral-950)] hover:text-[var(--neutral-950)]";

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`inline-flex items-center px-[14px] py-[8px] border font-mono font-medium text-[11px] tracking-[0.1em] uppercase cursor-pointer transition-colors ${classes}`}
      >
        {children}
      </button>
    );
  }

  return (
    <span className="inline-flex items-center px-[12px] py-[7px] border border-[var(--border-subtle)] font-mono font-medium text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)]">
      {children}
    </span>
  );
}
