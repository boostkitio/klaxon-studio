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
import Link from "next/link";
import ArrowLink from "@/components/ui/ArrowLink";
import { columnLabel, itemLink, itemTitle, itemMeta } from "@/components/RelatedLinks";
import { londonData, services, contentTypes, workAll, contactRows } from "@/lib/content";
import { faqPageSchema, breadcrumbSchema, londonServiceSchema } from "@/lib/schema";
import { ogFor } from "@/lib/site";
import { SHOWREEL_POSTER, SHOWREEL_VIMEO } from "@/lib/showreel";
import { heroPosterHref } from "@/lib/mux";
import { vimeoPosterSrcSet } from "@/lib/vimeo";

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

// Everything on this page below the intro is drawn from copy that already
// exists elsewhere on the site (service straplines and leads, case study
// leads, the studio address), so it cannot drift from those pages.
const allServices = [...contentTypes, ...services];
const pick = <T extends { slug: string }>(list: T[], slugs: string[]) =>
  slugs.map((s) => list.find((x) => x.slug === s)).filter((x): x is T => Boolean(x));

const londonServices = pick(allServices, [
  "corporate-video",
  "branded-content",
  "b2b-video",
  "social-content",
  "documentary",
  "product",
  "explainer-video",
  "podcast",
  "automotive",
  "film-crew-hire",
  "editing",
  "uk-production-services",
]);

const londonProcess = pick(allServices, ["ideation", "production-management", "filming", "editing"]);

const londonProjects = [
  "shell",
  "barclays-social-advice",
  "salesforce",
  "historic-england-bruce-grove",
  "aston-martin",
  "yorkshire-tea-branded-content",
]
  .map((id) => workAll.find((p) => p.id === id))
  .filter((p): p is (typeof workAll)[number] => Boolean(p));

const studio = contactRows.find((r) => r.label === "Studio");

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
          londonServiceSchema(londonServices),
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
          mobileSrc={HERO_VIDEO}
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
          <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,5.04vw,65px)] leading-[0.97] tracking-[-0.04em] max-w-[22ch] text-white">
            A video production company for one of the world&apos;s{" "}
            <span className="whitespace-nowrap">
              <HighlightSweep bg="var(--brand)" color="#fff" trigger="page">
                most demanding cities.
              </HighlightSweep>
            </span>
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
              posterSrcSet={vimeoPosterSrcSet(SHOWREEL_POSTER)}
              sizes="100vw"
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
            <h2 className={columnLabel}>
              <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
              Video production in London
            </h2>
            {londonData.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Everything below links out. This page used to be a dead end: no
          route from it to a single service or case study, on the one page
          Google sends "video production company london" to. */}
      <section className="pb-[clamp(40px,5vw,64px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <h2 className={columnLabel}>
            <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
            What we make in London
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[clamp(32px,4vw,56px)]">
            {londonServices.map((s) => (
              <Link key={s.slug} href={s.href} className={itemLink}>
                <span className={itemTitle}>{s.title}</span>
                <span className={itemMeta}>{s.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-[clamp(40px,5vw,64px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <h2 className={columnLabel}>
            <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
            Work from our London studio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[clamp(32px,4vw,56px)]">
            {londonProjects.map((p) => (
              <Link key={p.id} href={p.href} className={itemLink}>
                <span className={itemTitle}>{p.client}</span>
                <span className={itemMeta}>{p.title}</span>
                <span className="block mt-[8px] text-[clamp(13px,1.2vw,14px)] leading-[1.5] text-[var(--text-secondary)]">
                  {p.lead}
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-[clamp(24px,3vw,36px)]">
            <ArrowLink href="/work">See all our work</ArrowLink>
          </div>
        </div>
      </section>

      <section className="pb-[clamp(40px,5vw,64px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <h2 className={columnLabel}>
            <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
            How a London production runs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(32px,4vw,56px)]">
            {londonProcess.map((s, i) => (
              <Link key={s.slug} href={s.href} className={itemLink}>
                <span className={itemMeta}>
                  {String(i + 1).padStart(2, "0")} / {s.title}
                </span>
                <span className="block mt-[8px] text-[clamp(14px,1.32vw,15.5px)] leading-[1.6] text-[var(--text-secondary)] transition-colors group-hover:text-[var(--brand)]">
                  {s.lead}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-[clamp(48px,6vw,80px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <h2 className={columnLabel}>
            <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
            Our Bermondsey studio
          </h2>
          <p className="max-w-[62ch] text-[clamp(14px,1.32vw,15.5px)] leading-[1.64] text-[var(--text-secondary)]">
            Klaxon Studio is at {studio?.value}, a short walk from Bermondsey station on the Jubilee line.
            We work with clients in finance, automotive, broadcast, heritage, food and drink, sport, health and
            the charity sector, across London and well beyond it.
          </p>
          <div className="flex flex-wrap gap-x-[28px] gap-y-[12px] mt-[clamp(20px,2.4vw,28px)]">
            {studio && (
              <ArrowLink href={studio.href}>Get directions</ArrowLink>
            )}
            <ArrowLink href="/contact">Contact the studio</ArrowLink>
            <ArrowLink href="/pricing">See pricing</ArrowLink>
          </div>
        </div>
      </section>

      <section data-faq-end="1" className="bg-[var(--brand)] text-white pt-[clamp(56px,7vw,96px)] pb-[clamp(64px,8vw,112px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <h2 className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-white mb-[clamp(24px,3vw,38px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            London FAQs
          </h2>
          <FaqAccordion items={londonData.faqs} />
        </div>
      </section>

      <Testimonials />
    </main>
  );
}
