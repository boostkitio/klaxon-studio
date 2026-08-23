# klaxon.studio

The Klaxon Studio website — a Next.js App Router site deployed on Vercel, serving
[klaxon.studio](https://klaxon.studio) from `main`.

## Stack

| Concern | What we use |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4 + styled-components, tokens in `src/styles/tokens` |
| Content | Sanity — blog posts and the homepage client-logo marquee only |
| Video | Mux (hero and work-grid loops), Vimeo (showreel and case-study player) |
| Email | Resend, behind `/api/contact` |
| Analytics | GA4 via `@next/third-parties`, plus Vercel Analytics |

Most page copy is **not** in the CMS: it lives in `src/lib/content.ts`. Only the blog
and the client logos come from Sanity.

## Getting started

```bash
npm ci
npm run dev          # http://localhost:3000
```

`src/sanity/env.ts` falls back to the real project ID and dataset, so the site boots
without any env file. Two routes need network access to Sanity to render — `/` (client
logos) and `/blog` (post list) — and will 500 if it is unreachable. Everything else is
served from local content.

For the contact form and draft mode, copy `.env.example` to `.env.local` and fill it in.
Values are in the Vercel project settings.

| Script | Does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve a production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run verify` | Lint, typecheck, then a production build |

## Editing content

Sanity Studio is mounted at `/studio` on any deployment. Publishing a post or a logo
fires a webhook at `/api/revalidate`, which busts the relevant cache tags — no redeploy
needed. The Presentation tab gives live preview through draft mode.

## Layout

```
src/app/          routes: work, services, about, contact, blog, pricing,
                  faqs, glossary, london, sustainability, legal, studio, api
src/components/   shared UI
src/lib/          site content, Mux helpers, JSON-LD schema, rate limiting
src/sanity/       client, queries, schema types, presentation config
src/styles/       design tokens
```

`next.config.ts` carries two things worth knowing about: the Content-Security-Policy
(which every new third-party host must be added to, `/studio` excepted) and the redirect
map from the old WordPress URLs.

## Deployment

Pushes to `main` deploy to production on the Vercel project `klaxon-studio` (Boostkit
team). Every other branch gets its own preview URL, which is the right way to review a
change before it ships.

`docs/LAUNCH.md` records the DNS cutover from the old WordPress site and the
post-launch checks.

## Note on Next.js

See `AGENTS.md` — this project tracks a Next.js version whose APIs and conventions may
differ from what you expect. The bundled docs in `node_modules/next/dist/docs/` are the
source of truth.
