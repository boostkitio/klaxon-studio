import Link from "next/link";
import { notFound } from "next/navigation";
import Label from "@/components/ui/Label";
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

/** Full SEO titles for the service pages Ubersuggest flagged as too short.
 * Everything else keeps the plain svc.title, templated to "X | Klaxon Studio". */
const SEO_TITLES: Record<string, string> = {
  automotive: "Automotive Video Production | Klaxon Studio London",
  "b2b-video": "B2B Video Production | Klaxon Studio London",
  directing: "Video Directing Services | Klaxon Studio London",
  documentary: "Documentary Production Company | Klaxon Studio London",
  editing: "Video Editing Services | Klaxon Studio London",
  filming: "Video Filming Services | Klaxon Studio London",
  "health-sector": "Healthcare Video Production | Klaxon Studio London",
  podcast: "Podcast Production Company | Klaxon Studio London",
  product: "Product Video Production | Klaxon Studio London",
  "sound-design": "Sound Design Services | Klaxon Studio London",
  sport: "Sports Video Production | Klaxon Studio London",
};

export function generateStaticParams() {
  return allServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = allServices.find((s) => s.slug === slug);
  if (!svc) return {};
  const seoTitle = SEO_TITLES[svc.slug];
  if (!seoTitle) return ogFor(svc.title, svc.desc, `/services/${svc.slug}`);
  return {
    ...ogFor(seoTitle, svc.desc, `/services/${svc.slug}`),
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
