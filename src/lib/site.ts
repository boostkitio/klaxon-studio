import type { Metadata } from "next";

export const SITE_URL = "https://klaxon.studio";
export const SITE_NAME = "Klaxon Studio";

/** The brand line: root meta description and the business/website schema. */
export const SITE_DESCRIPTION =
  "Klaxon Studio is a full-service video production company in Bermondsey, London, making commercials, branded content, documentary, corporate, social and podcast film for brands that refuse to be ignored.";

const OG_IMAGE = {
  url: `${SITE_URL}/images/og-image.jpg`,
  secureUrl: `${SITE_URL}/images/og-image.jpg`,
  type: "image/jpeg",
  width: 1200,
  height: 630,
  alt: "Klaxon Studio",
};

/**
 * Shared Open Graph base. Next.js metadata merges shallowly, so any page
 * that declares `openGraph` replaces the root block wholesale — always
 * build page-level metadata via ogFor() (or spread OG_BASE) so images,
 * type, siteName and locale are never silently dropped.
 * Deliberately no `url` here: og:url must be per-page.
 */
export const OG_BASE = {
  siteName: SITE_NAME,
  locale: "en_GB",
  type: "website" as const,
  images: [OG_IMAGE],
};

export function ogFor(title: string, description: string, path: string): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...OG_BASE,
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
