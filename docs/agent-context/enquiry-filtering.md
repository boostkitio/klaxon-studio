# How contact enquiries are filtered

Added 17 November 2026 (central enquiry gate rollout). Before that the form went
straight to the studio by Resend with only a honeypot and a rate limit.

## Flow (`src/app/api/contact/route.ts`, logic in `src/lib/contactEnquiry.ts`)

1. Rate limit (5 an hour per address), Zod validation, the `website` honeypot.
2. **The central enquiry gate** (`src/lib/gateClient.ts`, copied verbatim from
   `C:\dev\projects\_HOME\shared-code\solicitation\`): a signed request to
   `crm.boostkit.io/leads/gate/klaxon-studio` (address derived from
   `HELD_ENQUIRIES_URL`, signed with `HELD_ENQUIRIES_SECRET`) carrying the
   enquiry and a signed release link. The platform runs the shared filter (rules,
   bot-shape checks and Jev) and answers:
   - **deliver:** emailed to `CONTACT_TO_EMAIL` by Resend, exactly as before;
   - **hold:** already listed on the Held enquiries page
     (crm.boostkit.io/agency/held); nothing else is sent;
   - **owner-test** (any @boostkit.io sender): emailed to matt@boostkit.io only,
     subject "[Klaxon] Test ...". Never sent to the studio; `deliverEnquiry`
     refuses it and so does the release route.
3. **Gate down** (no answer in 3 seconds): the local `screenEnquiry`
   (`src/lib/solicitation.ts`, rules only) decides. A local hold is posted to the
   Held enquiries page and emailed to Matt with the release link; only if both
   fail is it delivered. The visitor always sees the same success answer.

**Softer filter:** Klaxon's real briefs mention websites, Meta and Google ads, so
hold words are off (`holdWords: false`, here and in the gate settings). Pitches,
known pitchers, bot shapes and Jev's junk and pitch verdicts are still held.

## Release

`/api/contact/release?token=...`: GET shows a confirmation page and sends nothing;
POST (its button, or the Held page's Release) emails the studio. Links last 30 days.

## Variables (Vercel, Production and Preview)

`RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_TO_EMAIL` (delivery, as before);
`HELD_ENQUIRIES_URL`, `HELD_ENQUIRIES_SECRET` (site id `klaxon-studio`) and
`SOLICITATION_RELEASE_SECRET`, set 17 November 2026. `ENQUIRY_GATE=off` skips the
gate in an emergency.

## Tests

`npm test` runs the three shared `node:test` suites and
`src/lib/contactEnquiry.test.ts` (the gate's answers, a gate timeout, owner tests,
release). The shared files are never edited here: change them in `_HOME` and re-copy.
