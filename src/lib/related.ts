import { services, contentTypes, workAll, type ServiceDetail, type Project } from "./content";

/**
 * Curated internal-link graph for the service pages.
 *
 * Why this exists: every `/services/*` page was a link island. Nothing pointed
 * into it except the `/services` index and the nav, and nothing pointed out of
 * it at all. GSC (Aug 2026) had the whole set sitting at average positions
 * 45-72 with real impressions — Google understood the topics but had no reason
 * to treat any single page as authoritative. These maps give each service page
 * inbound links from the blog (the only part of the site earning non-brand
 * clicks, at positions 5-8) and outbound links to sibling services and proof.
 *
 * Deliberately hand-curated rather than derived from `Project.cat`: there are
 * only six category values across 27 projects, so anything automatic maps a
 * dozen unrelated projects onto each of the 23 services. Editorial relevance is
 * the whole point — a link a reader would actually follow is the only kind that
 * carries weight.
 *
 * Blog posts live in Sanity and carry no taxonomy field. Mapping by slug here
 * avoids a schema change plus a re-tagging pass in the Studio. If posts ever
 * gain a `services` reference array, this map is the thing to delete.
 */

/** Sibling services shown as "Related services". */
const relatedServiceSlugs: Record<string, string[]> = {
  // Production
  ideation: ["directing", "production-management", "branded-content"],
  "production-management": ["film-crew-hire", "uk-production-services", "filming"],
  directing: ["ideation", "filming", "documentary"],
  filming: ["directing", "film-crew-hire", "production-management"],
  "podcast-recording": ["podcast", "sound-design", "editing"],
  editing: ["colour-grading", "sound-design", "delivery-versioning"],
  "colour-grading": ["editing", "sound-design", "delivery-versioning"],
  "sound-design": ["editing", "colour-grading", "podcast-recording"],
  "delivery-versioning": ["editing", "social-content", "colour-grading"],
  "white-labelling": ["uk-production-services", "film-crew-hire", "production-management"],
  "uk-production-services": ["film-crew-hire", "production-management", "white-labelling"],
  "film-crew-hire": ["uk-production-services", "production-management", "filming"],

  // Content types
  "branded-content": ["documentary", "social-content", "corporate-video"],
  "corporate-video": ["b2b-video", "branded-content", "product"],
  "b2b-video": ["corporate-video", "explainer-video", "product"],
  documentary: ["branded-content", "sport", "health-sector"],
  product: ["branded-content", "explainer-video", "b2b-video"],
  sport: ["documentary", "branded-content", "social-content"],
  "health-sector": ["corporate-video", "documentary", "b2b-video"],
  podcast: ["podcast-recording", "sound-design", "social-content"],
  "social-content": ["branded-content", "delivery-versioning", "product"],
  "explainer-video": ["b2b-video", "product", "corporate-video"],
  automotive: ["branded-content", "sport", "documentary"],
};

/** Case studies shown as proof on each service page. */
const serviceProjectIds: Record<string, string[]> = {
  // Production
  ideation: ["dove-emotive-storytelling", "yorkshire-tea-branded-content", "jack-stein-inside-the-box"],
  "production-management": ["commonwealth-games", "peugeot-multi-camera", "goodwood"],
  directing: ["jack-stein-inside-the-box", "travis-mathew-ambassador-documentary", "dove-emotive-storytelling"],
  filming: ["aston-martin", "badminton-horse-trials", "goodwood"],
  "podcast-recording": ["jack-stein-inside-the-box", "salesforce", "barclays-social-advice"],
  editing: ["rize", "fei-sports-feature", "historic-england-bruce-grove"],
  "colour-grading": ["aston-martin", "dove-emotive-storytelling", "goodwood"],
  "sound-design": ["dove-emotive-storytelling", "historic-england-bruce-grove", "fei-sports-feature"],
  "delivery-versioning": ["boss-brand-promo", "rize", "barclays-social-advice"],
  "white-labelling": ["salesforce", "shell", "fei-sports-feature"],
  "uk-production-services": ["shell", "commonwealth-games", "telegraph-lullingstone-castle"],
  "film-crew-hire": ["commonwealth-games", "peugeot-multi-camera", "badminton-horse-trials"],

  // Content types
  "branded-content": ["yorkshire-tea-branded-content", "mahou-beer-promos", "shell"],
  "corporate-video": ["shell-corporate", "salesforce", "nested"],
  "b2b-video": ["salesforce", "nested", "barclays-social-advice"],
  documentary: ["historic-england-bruce-grove", "travis-mathew-ambassador-documentary", "jack-stein-inside-the-box"],
  product: ["aesme-instructional-video", "cavalor", "boss-brand-promo"],
  sport: ["commonwealth-games", "badminton-horse-trials", "scott-brash"],
  "health-sector": ["dove-emotive-storytelling", "barclays-social-advice", "nfu-sponsored-content"],
  podcast: ["jack-stein-inside-the-box", "salesforce", "barclays-social-advice"],
  "social-content": ["boss-brand-promo", "uniteq-brand-launch", "telegraph-lullingstone-castle"],
  "explainer-video": ["aesme-instructional-video", "nested", "salesforce"],
  automotive: ["aston-martin", "bmw-creative-car-review", "goodwood"],
};

/** Blog posts shown as "Related reading", and the source of the reverse links. */
const servicePostSlugs: Record<string, string[]> = {
  // Production
  ideation: ["how-to-build-a-video-content-strategy", "how-to-brief-a-video-production-company"],
  "production-management": ["what-happens-on-a-shoot-day", "how-to-brief-a-video-production-company"],
  directing: ["what-happens-on-a-shoot-day", "how-long-should-a-brand-film-be"],
  filming: ["what-happens-on-a-shoot-day", "how-much-does-video-production-cost"],
  "podcast-recording": ["what-makes-a-great-podcast", "how-much-does-video-production-cost"],
  editing: ["how-long-should-a-brand-film-be", "what-happens-on-a-shoot-day"],
  "colour-grading": ["how-long-should-a-brand-film-be", "how-much-does-video-production-cost"],
  "sound-design": ["what-makes-a-great-podcast", "how-long-should-a-brand-film-be"],
  "delivery-versioning": ["how-to-build-a-video-content-strategy", "how-long-should-a-brand-film-be"],
  "white-labelling": ["how-to-brief-a-video-production-company", "how-much-does-video-production-cost"],
  "uk-production-services": ["how-to-brief-a-video-production-company", "what-happens-on-a-shoot-day"],
  "film-crew-hire": ["what-happens-on-a-shoot-day", "how-much-does-video-production-cost"],

  // Content types
  "branded-content": ["what-is-branded-content", "how-long-should-a-brand-film-be"],
  // The ROI post was still unknown to Google ten weeks after launch (Oct 2026)
  // with a single inbound link, so both of its natural homes link to it.
  "corporate-video": ["why-your-corporate-video-isnt-working", "roi-for-a-corporate-video-production", "how-to-brief-a-video-production-company"],
  "b2b-video": ["why-most-b2b-video-is-forgettable", "roi-for-a-corporate-video-production", "why-your-corporate-video-isnt-working"],
  documentary: ["the-case-for-the-brand-documentary", "how-long-should-a-brand-film-be"],
  product: ["animation-vs-live-action-explainer-video", "what-is-branded-content"],
  sport: ["the-case-for-the-brand-documentary", "how-to-build-a-video-content-strategy"],
  "health-sector": ["video-for-the-health-sector", "why-your-corporate-video-isnt-working"],
  podcast: ["what-makes-a-great-podcast", "how-to-build-a-video-content-strategy"],
  "social-content": ["how-to-build-a-video-content-strategy", "what-is-branded-content"],
  "explainer-video": ["animation-vs-live-action-explainer-video", "why-most-b2b-video-is-forgettable"],
  automotive: ["what-is-branded-content", "how-long-should-a-brand-film-be"],
};

const allServices: ServiceDetail[] = [...services, ...contentTypes];

/** Sibling services for a service page, in curated order. */
export function relatedServicesFor(slug: string): ServiceDetail[] {
  return (relatedServiceSlugs[slug] ?? [])
    .map((s) => allServices.find((svc) => svc.slug === s))
    .filter((svc): svc is ServiceDetail => Boolean(svc));
}

/** Case studies for a service page, in curated order. */
export function relatedProjectsFor(slug: string): Project[] {
  return (serviceProjectIds[slug] ?? [])
    .map((id) => workAll.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p));
}

/**
 * Projects that belong with a service but are not among its three showcased
 * case studies. They only feed the reverse (case study -> service) links.
 */
const extraProjectServiceSlugs: Record<string, string[]> = {
  "subaru-branded-content": ["automotive", "branded-content"],
  "peugeot-multi-camera": ["automotive"],
};

/** Most service links a single case study will carry. */
const MAX_SERVICES_PER_PROJECT = 3;

/**
 * Reverse index: the services a case study links back to.
 *
 * The case studies are the most-linked pages on the site after the nav (every
 * one is on /work) yet linked out to nothing, while the service pages they
 * prove sat on as few as two inbound links. Derived from `serviceProjectIds`
 * so the two directions cannot drift apart.
 *
 * Content types sort ahead of production services: "corporate video" and
 * "automotive" are what a visitor reading a case study is shopping for, and
 * they are the pages with search demand behind them.
 */
export function servicesForProject(projectId: string): ServiceDetail[] {
  const slugs = [
    ...(extraProjectServiceSlugs[projectId] ?? []),
    ...Object.entries(serviceProjectIds)
      .filter(([, ids]) => ids.includes(projectId))
      .map(([slug]) => slug),
  ];
  const isContentType = (slug: string) => contentTypes.some((c) => c.slug === slug);
  return [...new Set(slugs)]
    .sort((a, b) => Number(isContentType(b)) - Number(isContentType(a)))
    .slice(0, MAX_SERVICES_PER_PROJECT)
    .map((s) => allServices.find((svc) => svc.slug === s))
    .filter((svc): svc is ServiceDetail => Boolean(svc));
}

/**
 * Picks `perSource` related targets for every source, so that inbound
 * links are spread across the set rather than piling onto the same few.
 *
 * `ranked[source]` lists the targets relevant to it, best first; nothing outside
 * that list is ever chosen, so balancing never produces an irrelevant link.
 * Pass 1 runs `minInbound` rounds: in each, the least-linked item (counting
 * `baseInbound`, the links it already gets elsewhere) claims a slot on the
 * page where it ranks highest. Pass 2 fills the remaining slots by relevance.
 * Sources and targets can be the same set (case study to case study) or
 * different ones (case study to blog post).
 * Deterministic: ties fall back to list order.
 */
function allocateRelated(
  sources: string[],
  targets: string[],
  ranked: Record<string, string[]>,
  perSource: number,
  minInbound: number,
  baseInbound: Record<string, number> = {},
): Record<string, string[]> {
  const chosen: Record<string, string[]> = Object.fromEntries(sources.map((id) => [id, []]));
  const inbound: Record<string, number> = Object.fromEntries(targets.map((id) => [id, 0]));
  const hasRoom = (source: string) => chosen[source].length < perSource;
  const order = (id: string, list: string[]) => list.indexOf(id);

  for (let round = 0; round < minInbound; round++) {
    const byNeed = [...targets].sort(
      (a, b) =>
        (baseInbound[a] ?? 0) + inbound[a] - ((baseInbound[b] ?? 0) + inbound[b]) ||
        order(a, targets) - order(b, targets),
    );
    for (const target of byNeed) {
      if (inbound[target] > round) continue;
      const source = sources
        .filter((s) => s !== target && hasRoom(s) && !chosen[s].includes(target) && ranked[s]?.includes(target))
        .sort(
          (a, b) =>
            ranked[a].indexOf(target) - ranked[b].indexOf(target) ||
            chosen[a].length - chosen[b].length ||
            order(a, sources) - order(b, sources),
        )[0];
      if (source) {
        chosen[source].push(target);
        inbound[target]++;
      }
    }
  }

  for (const source of sources) {
    for (const target of ranked[source] ?? []) {
      if (!hasRoom(source)) break;
      if (!chosen[source].includes(target)) {
        chosen[source].push(target);
        inbound[target] = (inbound[target] ?? 0) + 1;
      }
    }
  }

  for (const source of sources) {
    chosen[source].sort((a, b) => ranked[source].indexOf(a) - ranked[source].indexOf(b));
  }
  return chosen;
}

/** Every service a case study belongs to (uncapped), showcased or not. */
function allServiceSlugsForProject(projectId: string): string[] {
  return [
    ...new Set([
      ...(extraProjectServiceSlugs[projectId] ?? []),
      ...Object.entries(serviceProjectIds)
        .filter(([, ids]) => ids.includes(projectId))
        .map(([slug]) => slug),
    ]),
  ];
}

/**
 * "Selected work" on a case study page.
 *
 * Taking related projects only from each service's three showcased case
 * studies meant the same handful were linked everywhere while the rest got
 * nothing: Subaru had one in-content link on the whole site (from /work).
 * Candidates are ranked by shared services, then shared categories, then
 * sector, and allocated so every case study gets at least two.
 */
const relatedProjectIds: Record<string, string[]> = (() => {
  const ids = workAll.map((p) => p.id);
  const servicesOf = Object.fromEntries(ids.map((id) => [id, allServiceSlugsForProject(id)]));
  const ranked: Record<string, string[]> = {};
  for (const proj of workAll) {
    const scored = workAll
      .filter((other) => other.id !== proj.id)
      .map((other) => {
        const sharedServices = servicesOf[proj.id].filter((s) => servicesOf[other.id].includes(s)).length;
        const sharedCats = proj.cat.filter((c) => other.cat.includes(c)).length;
        const sameSector = proj.sector === other.sector ? 1 : 0;
        return { id: other.id, score: sharedServices * 2 + sharedCats + sameSector };
      })
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score || ids.indexOf(a.id) - ids.indexOf(b.id));
    ranked[proj.id] = scored.map((c) => c.id);
  }
  const showcased: Record<string, number> = {};
  for (const list of Object.values(serviceProjectIds)) {
    for (const id of list) showcased[id] = (showcased[id] ?? 0) + 1;
  }
  return allocateRelated(ids, ids, ranked, 3, 2, showcased);
})();

/** Other case studies for a case study page. */
export function relatedProjectsForProject(projectId: string): Project[] {
  return (relatedProjectIds[projectId] ?? [])
    .map((id) => workAll.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p));
}

/** Blog post slugs for a service page. Titles are resolved by the caller. */
export function relatedPostSlugsFor(slug: string): string[] {
  return servicePostSlugs[slug] ?? [];
}

/**
 * Guides for a case study page: the reading mapped to the services it proves.
 * Gives the blog a second source of in-content links besides the service
 * pages. Taking the first two posts per case study sent 13 links each to the
 * branded-content and brand-film-length posts and none to most others, so the
 * slots are balanced across every post a case study is relevant to.
 */
const projectPostSlugs: Record<string, string[]> = (() => {
  const isContentType = (slug: string) => contentTypes.some((c) => c.slug === slug);
  const ranked: Record<string, string[]> = {};
  for (const proj of workAll) {
    const slugs = allServiceSlugsForProject(proj.id)
      .sort((a, b) => Number(isContentType(b)) - Number(isContentType(a)))
      .flatMap((svc) => servicePostSlugs[svc] ?? []);
    ranked[proj.id] = [...new Set(slugs)];
  }
  const posts = [...new Set(Object.values(servicePostSlugs).flat())];
  return allocateRelated(workAll.map((p) => p.id), posts, ranked, 2, 2);
})();

export function relatedPostSlugsForProject(projectId: string): string[] {
  return projectPostSlugs[projectId] ?? [];
}

/**
 * "Related reading" on a blog post: other posts mapped to the same services.
 * Posts never linked to each other, so the two least-linked guides (corporate
 * video ROI and health sector) had two in-content links each. Allocated so
 * every mapped post gets at least two links from other posts.
 */
const relatedPostSlugs: Record<string, string[]> = (() => {
  const servicesOfPost: Record<string, string[]> = {};
  for (const [service, posts] of Object.entries(servicePostSlugs)) {
    for (const post of posts) (servicesOfPost[post] ??= []).push(service);
  }
  const slugs = Object.keys(servicesOfPost);
  const ranked: Record<string, string[]> = {};
  for (const post of slugs) {
    ranked[post] = slugs
      .filter((other) => other !== post)
      .map((other) => ({
        slug: other,
        shared: servicesOfPost[post].filter((s) => servicesOfPost[other].includes(s)).length,
      }))
      .filter((c) => c.shared > 0)
      .sort((a, b) => b.shared - a.shared || slugs.indexOf(a.slug) - slugs.indexOf(b.slug))
      .map((c) => c.slug);
  }
  const fromServices = Object.fromEntries(slugs.map((s) => [s, servicesOfPost[s].length]));
  return allocateRelated(slugs, slugs, ranked, 3, 2, fromServices);
})();

export function relatedPostSlugsForPost(postSlug: string): string[] {
  return relatedPostSlugs[postSlug] ?? [];
}

/** Most services a single blog post will link out to. */
const MAX_LINKS_PER_POST = 3;

/**
 * Reverse index: the services a given blog post links back to.
 *
 * Derived from `servicePostSlugs` so the two directions can never drift apart.
 *
 * Each post is capped at three outbound service links, otherwise the widely
 * mapped posts (the shoot-day and pricing ones are candidates for six services
 * each) turn into link farms and dilute what they pass on. The naive way to
 * apply that cap — take the first three candidates — silently starves whichever
 * services sort late in the map: it left `film-crew-hire` and `automotive` with
 * no inbound links at all, which are among the pages this whole exercise exists
 * to lift.
 *
 * So slots are allocated in two passes. The first guarantees every service one
 * inbound link by giving it its least-contended candidate post; the second fills
 * the remaining slots by relevance order. The result is deterministic (no ties
 * broken arbitrarily) and every service page ends up with at least one in-content
 * link from the blog.
 */
const postServiceSlugs: Record<string, string[]> = (() => {
  // Candidate services per post, in curated service order.
  const candidates: Record<string, string[]> = {};
  for (const [service, posts] of Object.entries(servicePostSlugs)) {
    for (const post of posts) {
      (candidates[post] ??= []).push(service);
    }
  }

  const assigned: Record<string, string[]> = {};
  for (const post of Object.keys(candidates)) assigned[post] = [];

  const hasRoom = (post: string) => assigned[post].length < MAX_LINKS_PER_POST;

  // Pass 1 — every service claims a slot on its least-loaded candidate post.
  for (const [service, posts] of Object.entries(servicePostSlugs)) {
    const target = posts
      .filter(hasRoom)
      .sort((a, b) => assigned[a].length - assigned[b].length)[0];
    if (target) assigned[target].push(service);
  }

  // Pass 2 — fill any slots left over, preserving relevance order.
  for (const [post, services] of Object.entries(candidates)) {
    for (const service of services) {
      if (!hasRoom(post)) break;
      if (!assigned[post].includes(service)) assigned[post].push(service);
    }
  }

  // Display in curated relevance order rather than allocation order.
  for (const post of Object.keys(assigned)) {
    assigned[post].sort(
      (a, b) => candidates[post].indexOf(a) - candidates[post].indexOf(b),
    );
  }

  return assigned;
})();

export function servicesForPost(postSlug: string): ServiceDetail[] {
  return (postServiceSlugs[postSlug] ?? [])
    .map((s) => allServices.find((svc) => svc.slug === s))
    .filter((svc): svc is ServiceDetail => Boolean(svc));
}
