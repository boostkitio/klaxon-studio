import Link from "next/link";
import Logo from "@/components/Logo";
import { footerCols, legalLinks } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";

export default function Footer() {
  return (
    <>
      <section className="cta-footer bg-[var(--brand)] text-white pt-[clamp(72px,10vw,140px)] pb-[clamp(72px,10vw,140px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] flex flex-wrap items-end justify-between gap-10">
          <h2 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[0.96] tracking-[-0.04em] text-white">
            Got something in mind.
            <br />
            <span className="text-[var(--neutral-950)]">Let&apos;s talk.</span>
          </h2>
          <ButtonLink href="/contact" variant="ghost-dark">
            Drop us a line
          </ButtonLink>
        </div>
      </section>

      <footer className="bg-[#1A1A1A] text-white pt-[clamp(56px,7vw,88px)] pb-[clamp(32px,4vw,44px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <div className="grid gap-[clamp(32px,4vw,56px)] pb-[clamp(40px,5vw,64px)] border-b border-white/16" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
            <div className="min-w-[180px]">
              <Logo variant="white" height={40} />
              <p className="mt-[18px] text-[14px] leading-[1.6] text-white/70 max-w-[30ch]">
                Video production that demands attention. Bermondsey, London.
              </p>
              <div className="mt-[14px]">
                <span className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-white/50">
                  Address
                </span>
                <a
                  href="https://maps.google.com/?cid=14804452344662294871"
                  target="_blank"
                  rel="noopener"
                  className="block mt-[4px] text-[14px] leading-[1.6] text-white/70 max-w-[30ch] hover:text-[var(--brand)] transition-colors"
                >
                  Unit 408, Cocoa Studios, The Biscuit Factory, 100 Drummond Road, London SE16 4FA
                </a>
              </div>
              <div className="mt-[14px]">
                <span className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-white/50">
                  Email
                </span>
                <a
                  href="mailto:hello@klaxon.studio"
                  className="block mt-[4px] text-[14px] leading-[1.6] text-white/70 max-w-[30ch] hover:text-[var(--brand)] transition-colors"
                >
                  hello@klaxon.studio
                </a>
              </div>
              <div className="mt-[14px]">
                <span className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-white/50">
                  Phone
                </span>
                <a
                  href="tel:+442080580669"
                  className="block mt-[4px] text-[14px] leading-[1.6] text-white/70 max-w-[30ch] hover:text-[var(--brand)] transition-colors"
                >
                  +44 (0) 208 0580 669
                </a>
              </div>
            </div>
            {footerCols.map((col) => (
              <div key={col.title}>
                <span className="font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-white/50">
                  {col.title}
                </span>
                <div className="flex flex-col gap-[11px] mt-[18px]">
                  {col.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      target={link.target}
                      rel={link.target === "_blank" ? "noopener" : undefined}
                      className="text-[14px] text-white/70 hover:text-[var(--brand)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 justify-between pt-6 font-mono font-medium text-[10px] tracking-[0.1em] uppercase text-white/70">
            <span>© 2026 Klaxon Studio Ltd</span>
            {/* Legal links live here rather than in the content columns
                above, so they carry less internal link weight than the
                commercial pages competing for brand-query sitelinks. */}
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="hover:text-white/70 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <span>Bermondsey · London</span>
          </div>
        </div>
      </footer>
    </>
  );
}
