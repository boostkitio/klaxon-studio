import { SITE_URL, SITE_NAME } from "./site";
import { muxThumbnail } from "./mux";
import type { Project, ServiceDetail, Faq } from "./content";

/**
 * Stable @id anchors. Every schema block that needs to refer to the business
 * or the site points at these rather than restating the entity, so Google
 * resolves the whole site to one node graph instead of many loose objects.
 *
 * BUSINESS_ID is the ProfessionalService declared in the root layout. That
 * block is the canonical entity and is tied to the Google Business Profile
 * via its hasMap CID.
 */
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

type Json = Record<string, unknown>;

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": BUSINESS_ID },
    inLanguage: "en-GB",
  };
}

/**
 * Declares the primary navigation in commercial priority order. This is a
 * hierarchy signal that feeds Google's sitelink selection. The legal pages
 * are deliberately excluded so they stop competing for a sitelink slot.
 */
export function siteNavigationSchema(): Json {
  const nav = [
    { name: "Work", url: `${SITE_URL}/work` },
    { name: "Services", url: `${SITE_URL}/services` },
    { name: "Pricing", url: `${SITE_URL}/pricing` },
    { name: "About", url: `${SITE_URL}/about` },
    { name: "Contact", url: `${SITE_URL}/contact` },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: "FAQs", url: `${SITE_URL}/faqs` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/#nav`,
    itemListElement: nav.map((item, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

/** trail excludes Home, which is prepended automatically. */
export function breadcrumbSchema(trail: { name: string; path: string }[]): Json {
  const items = [{ name: "Home", path: "" }, ...trail];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqPageSchema(faqs: Faq[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function videoObjectSchema(proj: Project): Json {
  const thumbnail = proj.vimeoThumb ?? muxThumbnail(proj.video);
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${proj.client}: ${proj.title}`,
    description: proj.lead,
    ...(thumbnail ? { thumbnailUrl: thumbnail } : {}),
    ...(proj.uploadDate ? { uploadDate: proj.uploadDate } : {}),
    ...(proj.duration ? { duration: proj.duration } : {}),
    ...(proj.vimeo
      ? { embedUrl: `https://player.vimeo.com/video/${proj.vimeo}` }
      : {}),
    ...(proj.video ? { contentUrl: proj.video } : {}),
    creator: { "@id": BUSINESS_ID },
    publisher: { "@id": BUSINESS_ID },
    isPartOf: { "@id": WEBSITE_ID },
    url: `${SITE_URL}/work/${proj.id}`,
  };
}

/**
 * Takes plain primitives rather than the Sanity document so callers can
 * stegaClean the values first. Stega-encoded characters are invisible in
 * rendered text but would corrupt JSON-LD.
 */
export function blogPostingSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  author?: string;
  imageUrl?: string;
}): Json {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@id": BUSINESS_ID },
    publisher: { "@id": BUSINESS_ID },
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-GB",
    ...(post.imageUrl ? { image: post.imageUrl } : {}),
  };
}

export function serviceSchema(svc: ServiceDetail): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: svc.title,
    description: svc.desc,
    url: `${SITE_URL}/services/${svc.slug}`,
    serviceType: svc.title,
    provider: { "@id": BUSINESS_ID },
    areaServed: ["London", "South East England", "United Kingdom"],
    ...(svc.includes.length
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${svc.title}: what's included`,
            itemListElement: svc.includes.map((item) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name: item },
            })),
          },
        }
      : {}),
  };
}

/**
 * The London page as a Service: video production, provided by the business,
 * in the city, with each linked service page as an offer. Gives Google the
 * same "this is a London video production company" statement in markup that
 * the page makes in copy.
 */
export function londonServiceSchema(offered: ServiceDetail[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Video production in London",
    serviceType: "Video production",
    url: `${SITE_URL}/london`,
    provider: { "@id": BUSINESS_ID },
    areaServed: { "@type": "City", name: "London" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Video production services in London",
      itemListElement: offered.map((svc) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: svc.title, url: `${SITE_URL}/services/${svc.slug}` },
      })),
    },
  };
}

/**
 * The published starting-point prices. `price` is the floor of an open-ended
 * band, so these are declared as PriceSpecification minimums rather than a
 * fixed price. The page says "from £X+", and the markup must say the same.
 */
export function pricingSchema(
  tiers: { label: string; price: string; items: string[] }[]
): Json {
  const toNumber = (p: string) => Number(p.replace(/[^0-9.]/g, ""));
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Video production pricing",
    url: `${SITE_URL}/pricing`,
    provider: { "@id": BUSINESS_ID },
    itemListElement: tiers.map((tier, i) => ({
      "@type": "Offer",
      position: i + 1,
      name: tier.label,
      description: tier.items.join(". "),
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: toNumber(tier.price),
        priceCurrency: "GBP",
        valueAddedTaxIncluded: false,
      },
      availability: "https://schema.org/InStock",
      itemOffered: { "@type": "Service", name: tier.label, provider: { "@id": BUSINESS_ID } },
    })),
  };
}
