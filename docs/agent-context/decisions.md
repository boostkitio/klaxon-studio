# Project decisions

Record durable, repository-safe technical decisions here. Include date,
decision, evidence, consequences, and superseded decision where applicable.
Do not store credentials or private client/commercial notes.

## 2026-10-07: service pages carry a search-facing heading and opening statement

- Decision: each `/services/*` page takes its H1, the link text pointing at it
  and its `Service` schema name from `serviceHeading()` in
  `src/lib/service-seo.ts`, and opens its body with the matching `SEO_INTROS`
  line. The design headline (`svc.title`) stays on tiles, the nav and the footer.
- Evidence: Search Console, 9 Sept to 6 Oct 2026. The service pages sat at
  positions 20 to 50 for "<service> production (london)" queries with H1s such
  as "B2B Video." that never used the word "production". `/london` took 172
  impressions for corporate video queries while `/services/corporate-video`
  took 4.
- Consequences: intros may only restate what the page already lists; do not add
  claims there. Prices on service pages come from `src/lib/pricing.ts`, the same
  source as `/pricing`. `/london` remains the page for "video production company
  london"; the home title still shares that phrase and is an open decision.
