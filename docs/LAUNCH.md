# Launch Runbook: klaxon.studio Cutover

The new site is live on Vercel (project `klaxon-studio`, boostkit team). This is everything
left to do to point klaxon.studio at it and retire the old WordPress site.

## 1. DNS Cutover — done 2026-07-15

Cutover completed: nameservers changed at 123-reg ~08:50, registry delegation propagated by
09:51, and klaxon.studio now serves the new site from Vercel with a valid cert (www 308s to the
apex, Gmail MX/SPF/DKIM/DMARC confirmed resolving via public DNS). Historical detail below.

- Registrar: Mesh Digital Limited (the 123-reg / Domainmonster / GoDaddy UK group). Log in there
  and change the nameservers from `ns1.siteground.net` / `ns2.siteground.net` to
  `ns1.vercel-dns.com` / `ns2.vercel-dns.com`.
- klaxon.studio (apex, production) and www (308 redirect to apex) are already attached to the
  Vercel project and verified.
- The full Vercel DNS zone is already staged (`vercel dns ls klaxon.studio`): all 5 Google
  Workspace MX records, Google SPF, `google._domainkey` DKIM, `_dmarc`, the
  google-site-verification TXT, the three Resend records from section 2, and the existing
  `prompts.klaxon.studio` subdomain (A 35.214.26.191 plus its SPF/DKIM). Apex/www/wildcard ALIAS
  and CAA records are Vercel-managed defaults.
- Gmail keeps working through the switch: the staged MX/SPF/DKIM/DMARC match what SiteGround
  serves today, so mail follows whichever nameservers answer during propagation.

Do not cancel SiteGround until the nameserver change has propagated and the checks in section 4
pass — SiteGround is still the live DNS host until then.

## 2. Resend Domain Verification (Contact Form From-Address)

The contact form currently sends from `klaxon@boostform.app` (verified interim domain) to
`hello@klaxon.studio`. The `klaxon.studio` domain has been registered in Resend (eu-west-1) and is
waiting for these DNS records — add them during the DNS work:

| Record | Type | Name | Value |
|--------|------|------|-------|
| DKIM | TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUeXbXOzqg+KosmNAqVZ...` (full value in Resend dashboard > Domains > klaxon.studio) |
| SPF | MX | `send` | `feedback-smtp.eu-west-1.amazonses.com` (priority 10) |
| SPF | TXT | `send` | `v=spf1 include:amazonses.com ~all` |

Once Resend shows the domain as verified, change `RESEND_FROM_EMAIL` on the Vercel project to
`Klaxon Studio <hello@klaxon.studio>` (production, preview, development) and redeploy.

Note: these records are on the `send` / `resend._domainkey` subdomains, so they do not interfere
with the client's existing mailbox MX records. Do not touch the root MX records.

## 3. Sanity (Blog + Client Logos)

The blog and homepage logo marquee are served from Sanity (project `nlulyy3d`, dataset
`production` — the same project the old rebuild used, reseeded). Everything else stays
hard-coded in `src/lib/content.ts`.

- Studio: `/studio` on the deployed site (edit posts and logos there; Presentation tab gives
  live preview)
- Publishing a post or logo fires the "klaxon-studio-site revalidate" webhook
  (Sanity manage > API > Webhooks) at `/api/revalidate`, which refreshes the static pages —
  no redeploy needed
- After the DNS cutover, update that webhook's URL from
  `https://klaxon-studio-site-two.vercel.app/api/revalidate` to
  `https://klaxon.studio/api/revalidate`
- A pre-migration backup of the old dataset is at
  `C:\dev\projects\_BACKUPS\sanity-nlulyy3d-production-2026-07-14.tar.gz`

## 4. Post-Cutover Checks (run 2026-07-15)

- Done: legacy redirects spot-checked on the live domain (`/about-us`, `/contact-us`,
  `/healthcare-video-production`, `/terms-conditions`, `/cookie-notice`, `/our-work-showreel`
  all 308 to the right pages)
- Done: contact form submitted on the live domain (Resend accepted, id
  8b3c953e-...) — confirm it arrived in the hello@klaxon.studio inbox
- Done: OG tags verified with curl on / and /work; og:image resolves (200, image/jpeg)
- Done: Sanity revalidation webhook URL switched to `https://klaxon.studio/api/revalidate`
- Done: Resend verified klaxon.studio (Jul 15 2:25 PM); `RESEND_FROM_EMAIL` is now
  `Klaxon Studio <hello@klaxon.studio>` in all three environments and the form was re-tested
  end-to-end on the live domain. (Resend's "Provider: SiteGround" label is a cosmetic stamp
  from when the domain was added pre-cutover; verification ran against the Vercel nameservers.)
- Done: GSC — `sc-domain:klaxon.studio` verified under matt@boostkit.io (TXT in Vercel DNS),
  sitemap.xml processed (75 URLs, 0 errors), old WordPress sitemap_index.xml removed from GSC
  and 301-redirected to /sitemap.xml.
- Vercel Bot Protection exempts verified bots (Googlebot) by default — nothing to do

## 5. Client Items Still Outstanding

- WhatsApp contact was removed (the build had a placeholder number, Ofcom's fictional 07700 900xxx range);
  add the real number back to `contactRows` / `footerCols` in `src/lib/content.ts` if the client wants it
- Client sign-off on the Pricing page figures (£2,000 / £4,500 day-rate anchors and project bands)
- Client review of the Privacy Policy page (written fresh — the old WordPress one was unedited boilerplate)

## 6. Retire the Old Infrastructure

After a stable week: cancel the old WordPress hosting.

Done 2026-10-01: the earlier builds were deleted so that `klaxon-studio` is the only Klaxon site
project. Removed Vercel projects `klxn`, `klxn-review`, `klaxon-legacy` and `klaxon-un6l`, and
GitHub repos `boostkitio/klxn`, `boostkitio/klxn-review` and `boostkitio/klaxon`. Full mirror
clones of the three repos are in `C:\dev\projects\_BACKUPS\klaxon-old-repos-2026-10-01`.
`klaxon-plans` is a separate project and was left alone.

Still open: `klaxon-studio-site.vercel.app` is an early build of this site in a Vercel account
outside the Boostkit team. It is public and indexed by Google, and needs deleting from whichever
account owns it.
