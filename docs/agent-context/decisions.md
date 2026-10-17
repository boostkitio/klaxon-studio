# Project decisions

Record durable, repository-safe technical decisions here. Include date,
decision, evidence, consequences, and superseded decision where applicable.
Do not store credentials or private client/commercial notes.

## 2026-10-17: SEO structure and internal linking

- Related links (case study to case study, case study to blog, blog to blog)
  are allocated by `allocateRelated()` in `src/lib/related.ts`, which only
  picks relevant candidates but guarantees every page at least two in-content
  links. Evidence: before, one case study had a single in-content link and two
  blog posts had two. Add new case studies or posts to the curated maps there
  and the allocation rebalances itself.
- The business JSON-LD (`businessSchema()`) is on every page and Next repeats
  JSON-LD in the hydration payload (about four copies per page), so keep it
  short. Offers belong on service pages, founders on `/about`
  (`businessFoundersSchema()`, same `@id`).
- Unlayered CSS in `src/styles/tokens/base.css` beats Tailwind utilities, so it
  must not set `text-decoration` on links either (it was hiding every
  `underline` class).
- The sitemap includes a video entry per case study. Next writes sitemap values
  verbatim, so `src/app/sitemap.ts` XML-escapes them.
