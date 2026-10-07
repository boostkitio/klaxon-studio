import { createHash } from "node:crypto";

/**
 * A fingerprint of everything hard-coded that makes up each case study and
 * service page: its copy, FAQs, search title/description, heading and opening
 * statement. The sitemap compares these against src/lib/sitemap-dates.json to
 * decide which lastmod dates are still true.
 *
 * Deliberately free of project imports so scripts/update-sitemap-dates.mjs can
 * load it with plain Node. Related-links changes are not fingerprinted.
 */
export function pageHashes(input: {
  work: { id: string }[];
  services: { slug: string }[];
  seoTitles: Record<string, string>;
  seoDescriptions: Record<string, string>;
  seoHeadings: Record<string, string>;
  seoIntros: Record<string, string>;
}): Record<string, string> {
  const hash = (value: unknown) =>
    createHash("sha256").update(JSON.stringify(value)).digest("hex").slice(0, 12);
  const out: Record<string, string> = {};
  for (const w of input.work) out[`/work/${w.id}`] = hash(w);
  for (const s of input.services) {
    out[`/services/${s.slug}`] = hash([
      s,
      input.seoTitles[s.slug],
      input.seoDescriptions[s.slug],
      input.seoHeadings[s.slug],
      input.seoIntros[s.slug],
    ]);
  }
  return out;
}
