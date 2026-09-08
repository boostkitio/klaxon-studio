export default function Label({
  children,
  tone = "default",
  as: Tag = "span",
}: {
  children: React.ReactNode;
  tone?: "default" | "on-dark" | "on-brand";
  as?: "span" | "h2";
}) {
  const color =
    tone === "on-dark"
      ? "text-[#ECEBE9]"
      : tone === "on-brand"
        ? "text-[var(--text-on-brand)]"
        : "text-[var(--text-muted)]";
  // The tick is brand coral, except on a coral section where ink keeps
  // contrast. White on coral fails WCAG AA at this type size.
  const tick = tone === "on-brand" ? "bg-[var(--neutral-950)]" : "bg-[var(--brand)]";

  return (
    <Tag className={`m-0 inline-flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase ${color}`}>
      <span className={`w-[4px] h-[1em] ${tick}`} />
      {children}
    </Tag>
  );
}
