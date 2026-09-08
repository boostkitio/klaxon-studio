import Image from "next/image";
import Label from "@/components/ui/Label";
import { ButtonLink } from "@/components/ui/Button";
import FaqAccordion from "@/components/FaqAccordion";
import Testimonials from "@/components/Testimonials";
import { HighlightSweep } from "@/components/ScrollHighlight";
import JsonLd from "@/components/JsonLd";
import HeroLoop from "@/components/HeroLoop";
import HeroPoster from "@/components/HeroPoster";
import VideoEmbed from "@/components/VideoEmbed";
import { londonData } from "@/lib/content";
import { faqPageSchema, breadcrumbSchema } from "@/lib/schema";
import { ogFor } from "@/lib/site";
import { SHOWREEL_POSTER, SHOWREEL_VIMEO } from "@/lib/showreel";
import { heroPosterHref } from "@/lib/mux";

const HERO_VIDEO =
  "https://stream.mux.com/2ZP9zQzGC01n7rwOSW9jk3n6rn2D6vG3It00DEcWLQLFw/720p.mp4";

/**
 * Search Console sends "video production company london" here (not the
 * homepage). Keep the title on that query and use Bermondsey in the body.
 */
const LONDON_TITLE = "Video Production Company London | Klaxon Studio";
export const metadata = {
  ...ogFor(
    LONDON_TITLE,
    "Klaxon Studio is a video production company in London, based in Bermondsey, making brand films, corporate video and social content across the city.",
    "/london"
  ),
  title: { absolute: LONDON_TITLE },
};

export default function LondonPage() {
  return (
    <main>
      <link
        rel="preload"
        as="image"
        href={heroPosterHref(HERO_VIDEO)}
        fetchPriority="high"
      />
      <JsonLd
        data={[
          faqPageSchema(londonData.faqs),
          breadcrumbSchema([{ name: "London", path: "/london" }]),
        ]}
      />
      <section className="relative bg-[#1A1A1A] text-white min-h-[clamp(640px,92vh,960px)] -mt-[85px] flex items-end overflow-hidden">
        <HeroPoster
          src={HERO_VIDEO}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <HeroLoop
          src={HERO_VIDEO}
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(26,26,26,0.1) 0%, rgba(26,26,26,0.04) 45%, rgba(26,26,26,0.65) 88%, rgba(26,26,26,1) 100%)",
          }}
        />
        <div className="relative max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] pt-[clamp(40px,7vw,96px)] pb-[clamp(40px,7vw,96px)] w-full">
          <div className="mb-[clamp(20px,3vw,34px)] text-white/78">
            <Label tone="on-dark">Klaxon Studio, Bermondsey, London</Label>
          </div>
          <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,5.04vw,65px)] leading-[0.97] tracking-[-0.04em] max-w-[16ch] text-white">
            A video production company for one of the world&apos;s{" "}
            <HighlightSweep bg="var(--brand)" color="#fff" trigger="page">
              most demanding cities.
            </HighlightSweep>
          </h1>
          <p className="mt-[clamp(22px,3vw,30px)] max-w-[52ch] text-[clamp(14px,1.3vw,15px)] leading-[1.55] text-white/82">
            {londonData.lead}
          </p>
          <div className="flex flex-wrap gap-[14px] mt-[clamp(28px,4vw,40px)]">
            <ButtonLink href="#showreel" variant="light" icon={false}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4l14 8-14 8z" />
              </svg>
              Play the showreel
            </ButtonLink>
            <ButtonLink href="/work" variant="ghost-light">
              See the work
            </ButtonLink>
            <ButtonLink href="/contact" variant="primary">
              Drop us a line
            </ButtonLink>
          </div>
        </div>
        <a
          href="#showreel"
          aria-label="Scroll to showreel"
          className="absolute left-1/2 bottom-[clamp(18px,2.4vw,28px)] -translate-x-1/2 z-10 text-white/70 hover:text-white transition-colors motion-safe:animate-bounce"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4v15" />
            <path d="M5 12l7 7 7-7" />
          </svg>
        </a>
      </section>

      {/* SHOWREEL */}
      <section id="showreel" className="bg-[#1A1A1A] text-white py-[clamp(52px,7vw,96px)] scroll-mt-[84px]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <div className="relative overflow-hidden bg-black" style={{ paddingTop: "41.67%" }}>
            <VideoEmbed
              src={SHOWREEL_VIMEO}
              poster={SHOWREEL_POSTER}
              title="Klaxon-Showreel-Master-24-LR"
              priority={false}
            />
            <span className="absolute left-[clamp(16px,2.4vw,28px)] top-[clamp(16px,2.4vw,28px)] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-white pointer-events-none [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
              Klaxon Showreel &apos;26
            </span>
          </div>
        </div>
      </section>

      <section className="pt-[clamp(48px,7vw,96px)] pb-[clamp(40px,5vw,64px)]">
        <div
          className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] grid gap-[clamp(40px,5vw,72px)] items-start"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}
        >
          <div className="relative self-stretch w-full overflow-hidden bg-[#1A1A1A] min-h-[320px]">
            <Image src="/uploads/WhatsApp Image 2026-07-10 at 11.57.29 (1).webp" alt="London production still" fill sizes="50vw" className="object-cover" />
          </div>
          <div className="flex flex-col gap-[22px] text-[clamp(14px,1.32vw,15.5px)] leading-[1.64] text-[var(--text-secondary)]">
            {londonData.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-[clamp(40px,5vw,64px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-[clamp(18px,2.2vw,26px)]">
            <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
            What we make in London
          </span>
          <div className="flex flex-wrap gap-[10px]">
            {londonData.includes.map((inc) => (
              <span
                key={inc}
                className="inline-flex items-center px-[14px] py-[9px] border border-[var(--border-subtle)] font-mono font-medium text-[11px] tracking-[0.06em] uppercase text-[var(--text-secondary)]"
              >
                {inc}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section data-faq-end="1" className="bg-[var(--brand)] text-white pt-[clamp(56px,7vw,96px)] pb-[clamp(64px,8vw,112px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-white mb-[clamp(24px,3vw,38px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            London FAQs
          </span>
          <FaqAccordion items={londonData.faqs} />
        </div>
      </section>

      <Testimonials />
    </main>
  );
}
