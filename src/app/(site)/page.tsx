import Link from "next/link";
import { ogFor } from "@/lib/site";
import Label from "@/components/ui/Label";
import { ButtonLink } from "@/components/ui/Button";
import ArrowLink from "@/components/ui/ArrowLink";
import Tag from "@/components/ui/Tag";
import Testimonials from "@/components/Testimonials";
import ProjectMedia from "@/components/ProjectMedia";
import ImageSlot from "@/components/ImageSlot";
import HeroLoop from "@/components/HeroLoop";
import HeroPoster from "@/components/HeroPoster";
import VideoEmbed from "@/components/VideoEmbed";
import { SHOWREEL_POSTER, SHOWREEL_VIMEO } from "@/lib/showreel";
import { heroPosterHref } from "@/lib/mux";

const HERO_VIDEO =
  "https://stream.mux.com/Kk6RRPVcOCPf1rUtr942EEyaI8200rfty9tDfTY7Jbro/720p.mp4";
const HERO_VIDEO_MOBILE =
  "https://stream.mux.com/c008Sb6JlZ2dtxU6XT68ApUu7cJn3RoSvgvPy8ViBtwU/480p.mp4";

const HOME_TITLE = "Klaxon Studio | Video Production Company London";
export const metadata = {
  ...ogFor(HOME_TITLE, "Klaxon Studio is a full-service video production company in Bermondsey, London, making commercials, branded content, documentary, corporate, social and podcast film for brands that refuse to be ignored.", ""),
  title: { absolute: HOME_TITLE },
};

import { HighlightSweep, HighlightWipe } from "@/components/ScrollHighlight";
import { homeServices, workAll, sectors } from "@/lib/content";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CLIENT_LOGOS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

type ClientLogo = { _id: string; name: string; logo: SanityImageSource; scale: number };

const workFeatured = workAll[0];
const workFeaturedB = workAll[1];
const workRest = workAll.slice(2, 8);
export default async function Home() {
  const clients = await sanityFetch<ClientLogo[]>({ query: CLIENT_LOGOS_QUERY, tags: ["clientLogo"] });
  const clientsLoop = [...clients, ...clients];
  return (
    <main>
      <link
        rel="preload"
        as="image"
        href={heroPosterHref(HERO_VIDEO_MOBILE)}
        media="(max-width: 767px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={heroPosterHref(HERO_VIDEO)}
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      {/* HERO */}
      <section className="relative bg-[#1A1A1A] text-white min-h-[clamp(640px,92vh,960px)] -mt-[85px] flex items-end overflow-hidden">
        <HeroPoster
          src={HERO_VIDEO_MOBILE}
          className="absolute inset-0 w-full h-full object-cover opacity-90 md:hidden"
        />
        <HeroPoster
          src={HERO_VIDEO}
          className="absolute inset-0 w-full h-full object-cover opacity-90 hidden md:block"
        />
        <HeroLoop
          src={HERO_VIDEO}
          mobileSrc={HERO_VIDEO_MOBILE}
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
          <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,5.04vw,65px)] leading-[0.97] tracking-[-0.04em] max-w-[15ch] text-white">
            Video production that{" "}
            <HighlightSweep bg="var(--brand)" color="#fff" trigger="page">
              demands attention.
            </HighlightSweep>
          </h1>
          <p className="mt-[clamp(22px,3vw,30px)] max-w-[50ch] text-[clamp(14px,1.3vw,15px)] leading-[1.55] text-white/82">
            We&apos;re a full-service video production company that makes content for ambitious brands and industry
            leading organisations.
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
              Start a project
            </ButtonLink>
          </div>
        </div>
        <a
          href="#showreel"
          aria-label="Scroll to showreel"
          className="hidden md:inline-flex items-center justify-center min-w-11 min-h-11 absolute left-1/2 bottom-[clamp(12px,1.8vw,20px)] -translate-x-1/2 z-10 text-white hover:text-white transition-colors motion-safe:animate-bounce"
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

      {/* SERVICES SPLIT */}
      <section className="pt-[clamp(48px,7vw,96px)] pb-[clamp(72px,10vw,128px)]">
        <div
          className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] grid grid-cols-1 lg:grid-cols-[minmax(0,1.85fr)_minmax(260px,0.82fr)] gap-[clamp(40px,5vw,72px)] items-start"
        >
          <div>
            <Label as="h2">What we do</Label>
            <div className="grid grid-cols-2 grid-rows-2 gap-0 lg:aspect-video mt-6">
              {homeServices.map((s) => (
                <Link
                  key={s.num}
                  href={s.href}
                  className="group relative overflow-hidden bg-[#1A1A1A] p-[clamp(22px,2.6vw,30px)] min-h-[200px] lg:min-h-0 flex flex-col justify-between gap-[18px] cursor-pointer transition-transform duration-200 hover:scale-[1.045] hover:z-10"
                >
                  <ImageSlot src={`/${s.img}`} alt={s.title} sizes="(min-width: 1024px) 30vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/15 z-[2]" />
                  <div className="absolute inset-0 bg-[var(--brand)] opacity-0 group-hover:opacity-90 transition-opacity duration-200 z-[3]" />
                  <span className="relative z-10 font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-[var(--brand)] group-hover:text-white transition-colors">
                    {s.num}
                  </span>
                  <div className="relative z-10">
                    <h3 className="font-display font-bold text-[20px] leading-[1.1] tracking-[-0.02em] mb-[10px] text-white">
                      {s.title}
                    </h3>
                    <p className="text-[13px] leading-[1.5] text-white/82">{s.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="self-center mt-0 lg:mt-[70px]">
            <h2 className="font-display font-[var(--kx-dw,700)] text-[clamp(25px,3.24vw,41px)] leading-[1.0] tracking-[-0.035em] mb-[22px]">
              Phone. Email.
              <br />
              Carrier Pigeon<span className="text-[var(--brand)]">.</span>
            </h2>
            <p className="mb-[30px] max-w-[38ch] text-[14px] leading-[1.55] text-[var(--text-secondary)]">
              Get in touch whichever way you prefer, we&apos;re surprisingly normal people.
            </p>
            <div className="inline-flex flex-col items-start gap-5">
              <ButtonLink href="/contact" variant="primary">
                Drop us a line
              </ButtonLink>
              <ArrowLink href="/services">View all services</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      {/* WORK GRID */}
      <section className="bg-[var(--brand)] text-white py-[clamp(72px,10vw,128px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-[clamp(40px,5vw,64px)]">
            <div>
              <div>
                <Label tone="on-brand">Featured work</Label>
              </div>
              <h2 className="font-display font-[var(--kx-dw,700)] text-[clamp(25px,3.24vw,41px)] leading-[1.0] tracking-[-0.035em] mt-4 text-white">
                Selected projects<span className="text-white">.</span>
              </h2>
            </div>
            <ArrowLink href="/work" className="text-[var(--neutral-950)] hover:text-white">
              View all projects
            </ArrowLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] gap-[clamp(10px,1.2vw,16px)] mb-[clamp(10px,1.2vw,16px)]">
            <Link
              href={workFeatured.href}
              className="group relative overflow-hidden bg-[#1A1A1A] cursor-pointer min-h-[clamp(320px,30vw,460px)]"
            >
              <ProjectMedia project={workFeatured} />
              <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              <div className="absolute inset-0 z-[3] bg-white opacity-0 group-hover:opacity-85 transition-opacity duration-200 pointer-events-none" />
              <div className="absolute left-0 right-0 bottom-0 z-10 p-[clamp(24px,2.4vw,34px)] pointer-events-none">
                <span className="block font-mono font-medium text-[10px] tracking-[0.12em] uppercase text-white group-hover:text-[var(--brand)] transition-colors mb-2">
                  {workFeatured.title}, {workFeatured.sector}
                </span>
                <span className="block font-display font-[var(--kx-dw,700)] text-[clamp(20px,2vw,26px)] leading-[1.1] tracking-[-0.015em] text-white group-hover:text-[var(--brand)] transition-colors">
                  {workFeatured.client}
                </span>
              </div>
            </Link>
            <Link href={workFeaturedB.href} className="group relative overflow-hidden bg-[#1A1A1A] cursor-pointer">
              <ProjectMedia project={workFeaturedB} />
              <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
              <div className="absolute inset-0 z-[3] bg-white opacity-0 group-hover:opacity-85 transition-opacity duration-200 pointer-events-none" />
              <div className="absolute left-0 right-0 bottom-0 z-10 p-[clamp(24px,2.4vw,34px)] pointer-events-none">
                <span className="block font-mono font-medium text-[10px] tracking-[0.12em] uppercase text-white group-hover:text-[var(--brand)] transition-colors mb-2">
                  {workFeaturedB.title}, {workFeaturedB.sector}
                </span>
                <span className="block font-display font-[var(--kx-dw,700)] text-[clamp(20px,2vw,26px)] leading-[1.1] tracking-[-0.015em] text-white group-hover:text-[var(--brand)] transition-colors">
                  {workFeaturedB.client}
                </span>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-[clamp(10px,1.2vw,16px)]">
            {workRest.map((p) => (
              <Link key={p.id} href={p.href} className="group relative aspect-[4/3] overflow-hidden bg-[#1A1A1A] cursor-pointer">
                <ProjectMedia project={p} />
                <div className="absolute inset-0 z-[2] bg-gradient-to-t from-black/72 to-transparent pointer-events-none" />
                <div className="absolute inset-0 z-[3] bg-white opacity-0 group-hover:opacity-85 transition-opacity duration-200 pointer-events-none" />
                <div className="absolute left-0 right-0 bottom-0 z-10 p-[clamp(18px,2vw,26px)] pointer-events-none">
                  <span className="block font-mono font-medium text-[10px] tracking-[0.12em] uppercase text-white group-hover:text-[var(--brand)] transition-colors mb-[6px]">
                    {p.title}, {p.sector}
                  </span>
                  <span className="block font-display font-[var(--kx-dw,700)] text-[19px] leading-[1.12] tracking-[-0.01em] text-white group-hover:text-[var(--brand)] transition-colors">
                    {p.client}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE WORK WITH */}
      <section className="pt-[clamp(48px,7vw,96px)]">
        <div
          className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] grid gap-[clamp(40px,5vw,72px)] items-start"
          style={{ gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))" }}
        >
          <div>
            <Label>Who we work with</Label>
            <h2 className="font-display font-[var(--kx-dw,700)] text-[clamp(23px,2.7vw,34px)] leading-[1.04] tracking-[-0.03em] mt-6">
              Made for the most
              <br />
              <HighlightWipe from="#1A1A1A" to="#fff" bg="var(--brand)" trigger="element">
                ambitious brands.
              </HighlightWipe>
            </h2>
          </div>
          <div>
            <p className="mb-[30px] text-[clamp(14px,1.3vw,15px)] leading-[1.6] text-[var(--text-secondary)]">
              We&apos;ve made films for some of the world&apos;s most demanding brands and organisations. From global
              financial institutions and iconic automotive brands to national broadcasters, heritage bodies, and
              challenger consumer brands. We don&apos;t shy away from a difficult brief; in a weird way, we actually
              enjoy it.
            </p>
            <div className="flex flex-wrap gap-2">
              {sectors.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          </div>
        </div>

        {/* CLIENT MARQUEE */}
        <div className="mt-[clamp(48px,6vw,80px)] bg-[var(--brand)] py-[clamp(26px,3.4vw,34px)] overflow-hidden">
          <div className="flex w-max items-center gap-[clamp(20px,2.6vw,34px)]" style={{ animation: "kx-marquee 64s linear infinite" }}>
            {clientsLoop.map((c, i) => (
              <span key={i} className="inline-flex items-center whitespace-nowrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlFor(c.logo).height(76).url()}
                  alt={c.name}
                  width={168}
                  height={38}
                  loading="lazy"
                  decoding="async"
                  style={{
                    height: `calc(clamp(28px,3vw,38px) * ${c.scale})`,
                    width: "auto",
                    maxWidth: `calc(clamp(120px,13vw,168px) * ${c.scale})`,
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                    opacity: 0.92,
                  }}
                />
              </span>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
    </main>
  );
}
