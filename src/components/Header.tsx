"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "@/components/Logo";
import { navItems, moreLinks } from "@/lib/content";

const pill = "px-[7px] py-[3px]";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/london";
  const [scrolled, setScrolled] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    setMoreOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const solid = !isHome || scrolled || mobileOpen;
  const moreActive = moreLinks.some((l) => pathname.startsWith(l.href));
  const blogActive = pathname.startsWith("/blog");
  const allMobileLinks = [...navItems, { label: "Blog", href: "/blog" }, ...moreLinks];

  const barStyle = {
    background: solid ? "rgba(236,235,233,0.9)" : "transparent",
    borderColor: solid ? "var(--border-subtle)" : "transparent",
    color: solid ? "var(--text-primary)" : "#fff",
    backdropFilter: solid ? "saturate(140%) blur(10px)" : "none",
    WebkitBackdropFilter: solid ? "saturate(140%) blur(10px)" : "none",
  };

  return (
    <header className="sticky top-0 z-50">
      <div className="transition-colors duration-300 border-b" style={barStyle}>
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] h-[84px] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="justify-self-start flex items-center">
            <nav className="hidden lg:flex items-center gap-[clamp(14px,2.5vw,34px)] flex-wrap">
              {navItems.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="inline-flex items-center font-mono font-medium text-[11px] tracking-[0.12em] uppercase hover:text-[var(--brand)] transition-colors"
                  >
                    <span className={`${pill} ${active ? "bg-[var(--brand)] text-white" : ""}`}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <Link
              href="/contact"
              className="lg:hidden inline-flex items-center gap-[9px] px-[12px] py-[11px] bg-[var(--brand)] text-white border border-[var(--brand)] font-mono font-medium text-[10px] tracking-[0.12em] uppercase whitespace-nowrap hover:bg-white hover:text-[var(--brand)] transition-colors"
            >
              Contact
            </Link>
          </div>

          <Link
            href="/"
            className="justify-self-center flex items-center"
            onClick={() => {
              if (pathname === "/") window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Logo variant="coral" height={64} className="h-[42px] w-auto lg:h-[64px]" priority={!isHome} />
          </Link>

          <div className="justify-self-end inline-flex items-center gap-[clamp(10px,2vw,26px)]">
            <Link
              href="/blog"
              className="hidden lg:inline-flex items-center font-mono font-medium text-[11px] tracking-[0.12em] uppercase hover:text-[var(--brand)] transition-colors whitespace-nowrap"
            >
              <span className={`${pill} ${blogActive ? "bg-[var(--brand)] text-white" : ""}`}>Blog</span>
            </Link>

            <div ref={moreRef} className="hidden lg:inline-flex relative items-center">
              <button
                onClick={() => setMoreOpen((v) => !v)}
                className="inline-flex items-center gap-[6px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase hover:text-[var(--brand)] transition-colors whitespace-nowrap bg-transparent border-0 cursor-pointer"
              >
                <span className={`${pill} ${moreActive ? "bg-[var(--brand)] text-white" : ""}`}>More</span>
                <span
                  className="inline-flex transition-transform duration-150"
                  style={{ transform: moreOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square">
                    <path d="M5 9l7 7 7-7" />
                  </svg>
                </span>
              </button>
              {moreOpen && (
                <div className="absolute top-[calc(100%+14px)] right-0 min-w-[180px] bg-white border border-[var(--border-subtle)] shadow-[var(--shadow-pop)] flex flex-col py-1 z-50">
                  {moreLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="px-4 py-[10px] font-mono font-medium text-[11px] tracking-[0.1em] uppercase text-[var(--text-primary)] hover:bg-[var(--brand)] hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center gap-[9px] px-[18px] py-[11px] bg-[var(--brand)] text-white border border-[var(--brand)] font-mono font-medium text-[10px] tracking-[0.12em] uppercase whitespace-nowrap hover:bg-white hover:text-[var(--brand)] transition-colors"
            >
              Drop us a line
            </Link>

            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="lg:hidden inline-flex items-center justify-center w-[36px] h-[36px] -mr-[6px] bg-transparent border-0 cursor-pointer text-inherit"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square">
                {mobileOpen ? (
                  <>
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </>
                ) : (
                  <>
                    <path d="M3 7h18" />
                    <path d="M3 12h18" />
                    <path d="M3 17h18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[84px] bottom-0 bg-[var(--kx-page,#ECEBE9)] overflow-y-auto">
          <nav className="flex flex-col px-[clamp(20px,5vw,48px)] py-[24px]">
            {allMobileLinks.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-[16px] border-b border-[var(--border-subtle)] font-display font-[var(--kx-dw,700)] text-[24px] leading-none tracking-[-0.02em] transition-colors"
                  style={{ color: active ? "var(--brand)" : "var(--text-primary)" }}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="mt-[28px] inline-flex items-center justify-center gap-[10px] px-[22px] py-[15px] bg-[var(--brand)] text-white border border-[var(--brand)] font-mono font-medium text-[12px] tracking-[0.12em] uppercase"
            >
              Drop us a line
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
