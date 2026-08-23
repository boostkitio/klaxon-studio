import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import RelatedLinks from "@/components/RelatedLinks";
import { services, contentTypes } from "@/lib/content";
import { relatedServicesFor, relatedProjectsFor, relatedPostSlugsFor } from "@/lib/related";
import { serviceSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";
import { ogFor } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POST_TITLES_BY_SLUGS_QUERY } from "@/sanity/lib/queries";

const allServices = [...services, ...contentTypes];
const kindFor = (slug: string) => (services.some((s) => s.slug === slug) ? "Production" : "Content");

/** Search-facing titles. The on-page title ("Corporate Video") is a design
 * headline; on its own it leaves out the words people search with
 * ("corporate video production london"), so every service gets a full title
 * here. A slug missing from the map falls back to "X | Klaxon Studio". */
const SEO_TITLES: Record<string, string> = {
  // Production
  ideation: "Video Ideation & Creative Development | Klaxon Studio",
  "production-management": "Video Production Management London | Klaxon Studio",
  directing: "Video Directing Services | Klaxon Studio London",
  filming: "Video Filming Services | Klaxon Studio London",
  "podcast-recording": "Podcast Recording Services London | Klaxon Studio",
  editing: "Video Editing Services | Klaxon Studio London",
  "colour-grading": "Colour Grading Services London | Klaxon Studio",
  "sound-design": "Sound Design Services | Klaxon Studio London",
  "delivery-versioning": "Video Delivery & Versioning | Klaxon Studio London",
  "white-labelling": "White Label Video Production UK | Klaxon Studio",
  "uk-production-services": "UK Production Services & Film Fixers | Klaxon Studio",
  "film-crew-hire": "Film Crew Hire London & UK | Klaxon Studio",

  // Content types
  "branded-content": "Branded Content Production London | Klaxon Studio",
  "corporate-video": "Corporate Video Production London | Klaxon Studio",
  "b2b-video": "B2B Video Production London | Klaxon Studio",
  documentary: "Documentary Production Company | Klaxon Studio London",
  product: "Product Video Production | Klaxon Studio London",
  sport: "Sports Video Production | Klaxon Studio London",
  "health-sector": "Healthcare Video Production | Klaxon Studio London",
  podcast: "Podcast Production Company | Klaxon Studio London",
  "social-content": "Social Media Video Production London | Klaxon Studio",
  "explainer-video": "Explainer Video Production London | Klaxon Studio",
  automotive: "Automotive Video Production | Klaxon Studio London",
};

/** Search-facing descriptions. svc.desc is a one-line strapline written for
 * the service tiles; as a search snippet it names neither the service nor the
 * place. These restate what each page's "What's included" list already
 * offers, so they make no claim the page does not. Keep them under 160
 * characters. */
const SEO_DESCRIPTIONS: Record<string, string> = {
  // Production
  ideation:
    "Video concept development, creative direction, scripting and storyboarding from Klaxon Studio, a video production company in Bermondsey, London.",
  "production-management":
    "Scheduling, budgeting, crewing, location scouting, permits and logistics. Video production management from Klaxon Studio in London.",
  directing:
    "Commercial, documentary and interview directors for hire in London. Creative, on-set and talent direction from Klaxon Studio.",
  filming:
    "Cinematography, camera crews, lighting and sound recording in London and across the UK, from single interviews to multi-camera productions.",
  "podcast-recording":
    "Podcast recording in London, in the studio or on location. Multi-guest recording, audio editing, sound mixing, music and sound design.",
  editing:
    "Video editing and post production in London: editing, colour grading, sound design, motion graphics, VFX, versioning and delivery.",
  "colour-grading":
    "Colour grading for film and video in London: LUT development, HDR, broadcast delivery and multi-format versioning from Klaxon Studio.",
  "sound-design":
    "Sound design and audio post production in London: dialogue editing, Foley, music supervision, mixing and broadcast audio delivery.",
  "delivery-versioning":
    "Multi-format versioning, broadcast delivery, social optimisation, subtitling, captioning and quality control for finished films.",
  "white-labelling":
    "White label video production for UK agencies: an outsourced production partner for overflow, retainers and on-site embedding, under your brand.",
  "uk-production-services":
    "UK production services for international shoots: local crew, fixers, location scouting and permits, equipment, casting and production management.",
  "film-crew-hire":
    "Film crew hire in London and across the UK: DoPs, camera operators, sound, lighting and grip, plus multi-camera and production crews.",

  // Content types
  "branded-content":
    "Branded content and brand film production in London for automotive, FMCG, financial services, sport, hospitality, technology and charity brands.",
  "corporate-video":
    "Corporate video production in London: internal communications, leadership messaging, culture and recruitment films, investor relations and training.",
  "b2b-video":
    "B2B video production in London: explainer videos, case studies and testimonials, thought leadership, sales enablement and event coverage.",
  documentary:
    "Documentary production in London and across the UK: brand documentaries, short films, observational and biographical films for broadcast and streaming.",
  product:
    "Product video production in London: launch films, e-commerce video, 360 and detail shots, lifestyle filming and social cutdowns.",
  sport:
    "Sports video production in London: athlete profiles, brand and sponsorship content, event and match coverage, broadcast production and social content.",
  "health-sector":
    "Healthcare video production in the UK: patient education, training and CPD, pharmaceutical and public health campaign films from a London studio.",
  podcast:
    "Podcast production company in London: brand podcasts, interview series, panel formats, and narrative and internal podcasts, produced as full series.",
  "social-content":
    "Social media video production in London: short-form video, Reels and TikTok content, campaign and always-on content, and paid social assets.",
  "explainer-video":
    "Explainer video production in London: animated and live action explainers, motion graphics, and product, SaaS and financial services videos.",
  automotive:
    "Automotive video production in London: car reviews, vehicle launch films, car-to-car filming, manufacturer and press drive content, and track filming.",
};

export function generateStaticParams() {
  return allServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = allServices.find((s) => s.slug === slug);
  if (!svc) return {};
  const seoTitle = SEO_TITLES[svc.slug];
  const description = SEO_DESCRIPTIONS[svc.slug] ?? svc.desc;
  if (!seoTitle) return ogFor(svc.title, description, `/services/${svc.slug}`);
  return {
    ...ogFor(seoTitle, description, `/services/${svc.slug}`),
    title: { absolute: seoTitle },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const svc = allServices.find((s) => s.slug === slug);
  if (!svc) notFound();

  const postSlugs = relatedPostSlugsFor(svc.slug);
  // Sanity returns these in document order, so re-sort into the curated order
  // from related.ts. A slug that no longer resolves (post unpublished in the
  // Studio) simply drops out rather than rendering a dead link.
  const fetched = postSlugs.length
    ? await sanityFetch<{ slug: string; title: string }[]>({
        query: POST_TITLES_BY_SLUGS_QUERY,
        params: { slugs: postSlugs },
        tags: ["post"],
      })
    : [];
  const relatedPosts = postSlugs
    .map((s) => fetched.find((p) => p.slug === s))
    .filter((p): p is { slug: string; title: string } => Boolean(p));

  return (
    <main>
      <JsonLd
        data={[
          serviceSchema(svc),
          ...(svc.faqs.length ? [faqPageSchema(svc.faqs)] : []),
          breadcrumbSchema([
            { name: "Services", path: "/services" },
            { name: svc.title, path: `/services/${svc.slug}` },
          ]),
        ]}
      />
      <section className="pt-[clamp(48px,6vw,84px)] pb-[clamp(28px,3.5vw,48px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <Link
            href="/services"
            className="inline-flex items-center gap-[9px] font-mono font-medium text-[10px] tracking-[0.12em] uppercase text-[var(--text-muted)] hover:text-[var(--brand)] transition-colors mb-[clamp(28px,4vw,44px)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square">
              <path d="M20 12H5" />
              <path d="M11 18l-6-6 6-6" />
            </svg>
            All services
          </Link>
          <div
            className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] gap-[clamp(40px,5vw,72px)] items-start"
          >
            <div className="min-w-0">
              <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-[clamp(16px,2.2vw,24px)]">
                <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
                {kindFor(svc.slug)}
              </span>
              <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[0.99] tracking-[-0.035em]">
                {svc.title}
                <span className="text-[var(--brand)]">.</span>
              </h1>
              <p className="mt-[clamp(20px,2.6vw,28px)] max-w-[34ch] font-display font-[var(--kx-dw,700)] text-[clamp(17px,1.9vw,23px)] leading-[1.2] tracking-[-0.02em]">
                {svc.lead}
              </p>
              <span className="block mt-[clamp(34px,4.5vw,52px)] font-mono font-medium text-[10px] tracking-[0.14em] uppercase text-[var(--text-muted)]">
                What&apos;s included
              </span>
              <div className="flex flex-wrap gap-2 my-[18px] mb-[30px]">
                {svc.includes.map((inc) => (
                  <span
                    key={inc}
                    className="inline-flex items-center px-[12px] py-[7px] border border-[var(--border-subtle)] font-mono font-medium text-[10px] tracking-[0.1em] uppercase text-[var(--text-secondary)]"
                  >
                    {inc}
                  </span>
                ))}
              </div>
              <div className="flex flex-col items-start gap-3">
                <ButtonLink href="/contact" variant="primary">
                  Discuss your project
                </ButtonLink>
                <ButtonLink href="/work" variant="ghost-brand" icon={false}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4l14 8-14 8z" />
                  </svg>
                  Play the showreel
                </ButtonLink>
                <ButtonLink href="/work" variant="ghost-brand">
                  See the work
                </ButtonLink>
              </div>
            </div>
            <div className="min-w-0 flex flex-col gap-[22px] text-[clamp(14px,1.32vw,15.5px)] leading-[1.64] text-[var(--text-secondary)] mt-[calc(13px+clamp(16px,2.2vw,24px))]">
              {svc.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RelatedLinks
        projects={relatedProjectsFor(svc.slug)}
        services={relatedServicesFor(svc.slug)}
        posts={relatedPosts}
      />

      <section data-faq-end="1" className="bg-[var(--brand)] text-white pt-[clamp(32px,4vw,56px)] pb-[clamp(56px,7vw,96px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-white mb-[clamp(26px,3.2vw,42px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            FAQs
          </span>
          <FaqAccordion items={svc.faqs} />
        </div>
      </section>
    </main>
  );
}
