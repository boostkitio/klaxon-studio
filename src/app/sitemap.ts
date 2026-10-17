import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { workAll, services, contentTypes, type Project } from "@/lib/content";
import { muxThumbnail } from "@/lib/mux";
import { vimeoPlayerUrl } from "@/lib/schema";
import { SEO_TITLES, SEO_DESCRIPTIONS } from "@/lib/service-seo";
import { pageHashes } from "@/lib/page-hashes";
import sitemapDates from "@/lib/sitemap-dates.json";
import { client } from "@/sanity/lib/client";
import { POST_SLUGS_QUERY } from "@/sanity/lib/queries";

// Case study and service copy is hard-coded in content.ts, so there is no
// per-page timestamp to read. Instead sitemap-dates.json records, for each
// page, a fingerprint of its content and the date that fingerprint first
// appeared (scripts/update-sitemap-dates.mjs writes it before every local
// build). A page only gets a lastmod while its fingerprint still matches;
// if the file is stale the date is left off rather than guessed, because
// Google stops trusting lastmod once it is wrong. Blog posts take their real
// edit time from Sanity.
const hashes = pageHashes({
  work: workAll,
  services: [...services, ...contentTypes],
  seoTitles: SEO_TITLES,
  seoDescriptions: SEO_DESCRIPTIONS,
});
const dates: Record<string, { hash: string; date: string } | undefined> = sitemapDates;
const lastModifiedFor = (path: string) =>
  dates[path]?.hash === hashes[path] ? dates[path]?.date : undefined;

// Next writes sitemap values into the XML verbatim, so anything with "&"
// (thumbnail query strings, "Food & Drink") has to be escaped here.
const xml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

/** ISO 8601 duration ("PT6M25S") to whole seconds, as video sitemaps expect. */
const isoDurationToSeconds = (iso?: string) => {
  const m = iso?.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return undefined;
  return Number(m[1] ?? 0) * 3600 + Number(m[2] ?? 0) * 60 + Number(m[3] ?? 0);
};

/**
 * Video sitemap entry for a case study: the film is the page's main content,
 * and the sitemap is how Google finds a Vimeo film that sits behind a
 * click-to-play poster. Mirrors videoObjectSchema() in lib/schema.ts.
 */
const videoFor = (proj: Project) => {
  const thumbnail = proj.vimeoThumb ?? muxThumbnail(proj.video, 1280);
  if (!thumbnail || !proj.vimeo) return undefined;
  return [
    {
      title: xml(`${proj.client}: ${proj.title}`),
      description: xml(`${proj.lead} ${proj.client} case study by Klaxon Studio, a video production company in London.`),
      thumbnail_loc: xml(thumbnail),
      player_loc: xml(vimeoPlayerUrl(proj)),
      ...(proj.video ? { content_loc: xml(proj.video) } : {}),
      duration: isoDurationToSeconds(proj.duration),
      publication_date: proj.uploadDate,
      family_friendly: "yes" as const,
    },
  ];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await client
    .withConfig({ useCdn: false, stega: false })
    .fetch<{ slug: string; updatedAt: string }[]>(
      POST_SLUGS_QUERY,
      {},
      { token: process.env.SANITY_API_READ_TOKEN, perspective: "published" }
    );
  const staticPaths = [
    "",
    "/work",
    "/services",
    "/about",
    "/pricing",
    "/blog",
    "/contact",
    "/faqs",
    "/glossary",
    "/london",
    "/sustainability",
    "/terms",
    "/privacy-policy",
  ];

  return [
    ...staticPaths.map((p) => ({
      url: `${SITE_URL}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
    ...workAll.map((w) => ({
      url: `${SITE_URL}/work/${w.id}`,
      lastModified: lastModifiedFor(`/work/${w.id}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      videos: videoFor(w),
    })),
    ...[...services, ...contentTypes].map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: lastModifiedFor(`/services/${s.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...blogPosts.map((b) => ({
      url: `${SITE_URL}/blog/${b.slug}`,
      lastModified: b.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
