// Keeps src/lib/sitemap-dates.json true. Runs before every local build
// (package.json "prebuild"): any case study or service page whose content
// fingerprint has changed since the file was last written gets today's date.
// Commit the updated file with the content change.
//
// Skipped on Vercel and CI, which must never invent dates: there the sitemap
// simply leaves lastmod off any page whose fingerprint is not in the file.
// It also never fails a build - a sitemap without dates is still valid.
import fs from "node:fs";

if (process.env.VERCEL || process.env.CI) process.exit(0);

try {
  // Node strips the types from these on import (Node 22.18+).
  const { workAll, services, contentTypes } = await import("../src/lib/content.ts");
  const { SEO_TITLES, SEO_DESCRIPTIONS } = await import("../src/lib/service-seo.ts");
  const { pageHashes } = await import("../src/lib/page-hashes.ts");

  const file = new URL("../src/lib/sitemap-dates.json", import.meta.url);
  const previous = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
  const hashes = pageHashes({
    work: workAll,
    services: [...services, ...contentTypes],
    seoTitles: SEO_TITLES,
    seoDescriptions: SEO_DESCRIPTIONS,
  });
  const today = new Date().toISOString().slice(0, 10);

  const next = {};
  const changed = [];
  for (const [path, hash] of Object.entries(hashes)) {
    if (previous[path]?.hash === hash) {
      next[path] = previous[path];
    } else {
      next[path] = { hash, date: today };
      changed.push(path);
    }
  }

  if (changed.length || Object.keys(previous).length !== Object.keys(next).length) {
    fs.writeFileSync(file, JSON.stringify(next, null, 2) + "\n");
    console.log(`sitemap dates: ${changed.length} page(s) changed, dated ${today}`);
  }
} catch (err) {
  console.warn("sitemap dates not updated:", err.message);
}
