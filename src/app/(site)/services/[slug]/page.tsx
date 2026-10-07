import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import RelatedLinks, { columnLabel, itemLink, itemTitle, itemMeta } from "@/components/RelatedLinks";
import ArrowLink from "@/components/ui/ArrowLink";
import { services, contentTypes } from "@/lib/content";
import { relatedServicesFor, relatedProjectsFor, relatedPostSlugsFor } from "@/lib/related";
import { serviceSchema, faqPageSchema, breadcrumbSchema } from "@/lib/schema";
import { ogFor } from "@/lib/site";
import { SEO_TITLES, SEO_DESCRIPTIONS, SEO_INTROS, serviceHeading } from "@/lib/service-seo";
import { pricingTiers } from "@/lib/pricing";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POST_TITLES_BY_SLUGS_QUERY } from "@/sanity/lib/queries";

const allServices = [...services, ...contentTypes];
const kindFor = (slug: string) => (services.some((s) => s.slug === slug) ? "Production" : "Content");

// The four stages every commissioned film goes through, each linking to the
// page that covers it. Shown on the content-type pages, where a visitor is
// buying a finished film; a podcast series does not run this way.
const processSteps = ["ideation", "production-management", "filming", "editing"]
  .map((slug) => services.find((s) => s.slug === slug))
  .filter((s): s is (typeof services)[number] => Boolean(s));
const showsProcess = (slug: string) => kindFor(slug) === "Content" && slug !== "podcast";

// The published starting points are for a shoot day, so they are only quoted
// on pages that sell one: the filmed content types and the crew services.
const crewSlugs = ["filming", "film-crew-hire", "uk-production-services"];
const showsCost = (slug: string) => showsProcess(slug) || crewSlugs.includes(slug);
const [shootTier, crewTier] = pricingTiers;

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

  const heading = serviceHeading(svc);
  const intro = SEO_INTROS[svc.slug];
  const projects = relatedProjectsFor(svc.slug);

  return (
    <main>
      <JsonLd
        data={[
          serviceSchema(svc, { name: heading, description: SEO_DESCRIPTIONS[svc.slug] ?? svc.desc }),
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
                {heading}
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
              {intro && <p>{intro}</p>}
              {svc.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Proof, in the page's own words: each case study with the line that
          says what was made, not just a client name. */}
      {projects.length > 0 && (
        <section className="pt-[clamp(40px,5vw,72px)]">
          <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
            <h2 className={columnLabel}>
              <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
              {heading}: selected work
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[clamp(32px,4vw,56px)]">
              {projects.map((p) => (
                <Link key={p.id} href={p.href} className={itemLink}>
                  <span className={itemTitle}>{p.client}</span>
                  <span className={itemMeta}>{p.title}</span>
                  <span className="block mt-[8px] text-[clamp(13px,1.2vw,14px)] leading-[1.5] text-[var(--text-secondary)]">
                    {p.lead}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {showsProcess(svc.slug) && (
        <section className="pt-[clamp(40px,5vw,64px)]">
          <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
            <h2 className={columnLabel}>
              <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
              How a project runs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[clamp(32px,4vw,56px)]">
              {processSteps.map((s, i) => (
                <Link key={s.slug} href={s.href} className={itemLink}>
                  <span className={itemMeta}>
                    {String(i + 1).padStart(2, "0")} / {s.title}
                  </span>
                  <span className="block mt-[8px] text-[clamp(14px,1.32vw,15.5px)] leading-[1.6] text-[var(--text-secondary)] transition-colors group-hover:text-[var(--brand)]">
                    {s.desc}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pt-[clamp(40px,5vw,64px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          {showsCost(svc.slug) && (
            <>
              <h2 className={columnLabel}>
                <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
                What it costs
              </h2>
              <p className="max-w-[62ch] text-[clamp(14px,1.32vw,15.5px)] leading-[1.64] text-[var(--text-secondary)]">
                Every project is quoted from scratch, but we publish our starting points. A single shoot day
                at one location with a small crew, one edited 1-2 minute film and social cutdowns starts
                from {shootTier.price} exc VAT. Crew and kit only, with the raw footage handed over at the
                end of the day, starts from {crewTier.price} exc VAT.
              </p>
            </>
          )}
          <div className={`flex flex-wrap gap-x-[28px] gap-y-[12px] ${showsCost(svc.slug) ? "mt-[clamp(20px,2.4vw,28px)]" : ""}`}>
            {showsCost(svc.slug) && <ArrowLink href="/pricing">See video production pricing</ArrowLink>}
            <ArrowLink href="/london">Video production company in London</ArrowLink>
          </div>
        </div>
      </section>

      <RelatedLinks
        projects={[]}
        services={relatedServicesFor(svc.slug)}
        posts={relatedPosts}
      />

      <section data-faq-end="1" className="bg-[var(--brand)] text-white pt-[clamp(32px,4vw,56px)] pb-[clamp(56px,7vw,96px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <h2 className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-white mb-[clamp(26px,3.2vw,42px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            FAQs
          </h2>
          <FaqAccordion items={svc.faqs} />
        </div>
      </section>
    </main>
  );
}
