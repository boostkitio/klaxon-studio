import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { workAll, services, contentTypes } from "@/lib/content";
import { client } from "@/sanity/lib/client";
import { POST_SLUGS_QUERY } from "@/sanity/lib/queries";

// Case study and service copy is hard-coded in content.ts, so there is no
// per-page timestamp to read. This is the date that copy, its metadata or its
// in-content links last changed; bump it when they change again. Google only
// trusts lastmod while it stays accurate, so do not replace it with the build
// date. Blog posts take their real edit time from Sanity.
const WORK_AND_SERVICES_UPDATED = "2026-10-01";

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
      lastModified: WORK_AND_SERVICES_UPDATED,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...[...services, ...contentTypes].map((s) => ({
      url: `${SITE_URL}/services/${s.slug}`,
      lastModified: WORK_AND_SERVICES_UPDATED,
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
