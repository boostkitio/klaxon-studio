import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "./site";
import { muxThumbnail } from "./mux";
import {
  services,
  contentTypes,
  founders,
  type Project,
  type ServiceDetail,
  type Faq,
  type GlossaryTerm,
} from "./content";

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

/** Every service and content type, so the entity's topics match the site's pages. */
const allServices: ServiceDetail[] = [...services, ...contentTypes];

/** Stable @id for a founder, so bylines and the business point at one Person. */
const personId = (fullName: string) =>
  `${SITE_URL}/about#${fullName.toLowerCase().replace(/[^a-z]+/g, "-")}`;

function founderPerson(f: (typeof founders)[number]): Json {
  return {
    "@type": "Person",
    "@id": personId(f.fullName),
    name: f.fullName,
    jobTitle: f.role.replace("Co-Founder · ", "Co-founder, "),
    url: `${SITE_URL}/about`,
    worksFor: { "@id": BUSINESS_ID },
  };
}

/**
 * The business entity, rendered once in SiteChrome. Every other block refers
 * to it by BUSINESS_ID. hasMap ties it to the Google Business Profile, and
 * sameAs to the brand's own social profiles, so search engines can resolve
 * "Klaxon Studio" to one entity. Only facts the site itself states belong
 * here: no ratings (self-serving review markup is ignored or penalised).
 */
export function businessSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: SITE_NAME,
    legalName: "Klaxon Studio Ltd",
    alternateName: "Klaxon",
    description: SITE_DESCRIPTION,
    slogan: "Video production that demands attention.",
    // The about page: "In May 2024, Klaxon Studio launched".
    foundingDate: "2024-05",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: `${SITE_URL}/images/klxn-coral.png`,
      width: 1600,
      height: 583,
      caption: SITE_NAME,
    },
    image: `${SITE_URL}/images/og-image.jpg`,
    telephone: "+44 20 8058 0669",
    email: "hello@klaxon.studio",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+44 20 8058 0669",
      email: "hello@klaxon.studio",
      areaServed: "GB",
      availableLanguage: "en-GB",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Unit 408, Cocoa Studios, The Biscuit Factory, 100 Drummond Road",
      addressLocality: "London",
      postalCode: "SE16 4FA",
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 51.4943706,
      longitude: -0.0617451,
    },
    hasMap: "https://maps.google.com/?cid=14804452344662294871",
    sameAs: [
      "https://instagram.com/klaxonstudiouk",
      "https://www.linkedin.com/company/klaxon-studio",
    ],
    areaServed: ["London", "South East England", "United Kingdom"],
    // Kept short: this block is on every page, and Next repeats JSON-LD in
    // the hydration payload, so each byte here ships several times per page.
    // Offers live on the service pages (serviceSchema); founders on /about.
    knowsAbout: ["Video production", ...allServices.map((s) => s.title)],
  };
}

/**
 * Rendered on /about only. Same @id as businessSchema(), so search engines
 * merge it into the one business entity rather than reading a second one.
 */
export function businessFoundersSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": BUSINESS_ID,
    name: SITE_NAME,
    founder: founders.map(founderPerson),
  };
}

export function websiteSchema(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: "Klaxon",
    description: SITE_DESCRIPTION,
    publisher: { "@id": BUSINESS_ID },
    inLanguage: "en-GB",
  };
}

/**
 * The work index as a list of case studies, so each film is tied to the
 * collection page that groups it rather than discovered one link at a time.
 */
export function caseStudyListSchema(projects: Project[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/work#page`,
    url: `${SITE_URL}/work`,
    name: "Video production case studies",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": BUSINESS_ID },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/work/${p.id}`,
        name: `${p.client}: ${p.title}`,
      })),
    },
  };
}

/** The glossary as a DefinedTermSet: each term is a definition of its own. */
export function glossarySchema(terms: GlossaryTerm[]): Json {
  const setId = `${SITE_URL}/glossary#terms`;
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": setId,
    name: "Video production glossary",
    url: `${SITE_URL}/glossary`,
    publisher: { "@id": BUSINESS_ID },
    inLanguage: "en-GB",
    hasDefinedTerm: terms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.t,
      description: term.d,
      inDefinedTermSet: setId,
    })),
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

/**
 * The embeddable player URL. Unlisted Vimeo films only play with their
 * privacy hash, so leaving it off hands Google a player that will not load.
 */
export function vimeoPlayerUrl(proj: Project): string {
  return `https://player.vimeo.com/video/${proj.vimeo}${proj.vimeoHash ? `?h=${proj.vimeoHash}` : ""}`;
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
    ...(proj.vimeo ? { embedUrl: vimeoPlayerUrl(proj) } : {}),
    ...(proj.video ? { contentUrl: proj.video } : {}),
    creator: { "@id": BUSINESS_ID },
    publisher: { "@id": BUSINESS_ID },
    isPartOf: { "@id": WEBSITE_ID },
    url: `${SITE_URL}/work/${proj.id}`,
  };
}

/**
 * A byline that matches a founder resolves to that founder's Person node (with
 * the about page and employer attached). Anything else stays a plain Person,
 * and no byline falls back to the business itself.
 */
function authorFor(name?: string): Json {
  if (!name) return { "@id": BUSINESS_ID };
  const founder = founders.find((f) => f.fullName === name);
  return founder ? founderPerson(founder) : { "@type": "Person", name };
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
  /** Sanity's _updatedAt. Ignored when it predates publishedAt (back-dated posts). */
  updatedAt?: string;
  author?: string;
  imageUrl?: string;
}): Json {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const modified =
    post.updatedAt && new Date(post.updatedAt) > new Date(post.publishedAt)
      ? post.updatedAt
      : post.publishedAt;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: post.publishedAt,
    dateModified: modified,
    author: authorFor(post.author),
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
