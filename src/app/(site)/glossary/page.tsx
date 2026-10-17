import Link from "next/link";
import Label from "@/components/ui/Label";
import JsonLd from "@/components/JsonLd";
import { glossaryData, services, contentTypes } from "@/lib/content";
import { breadcrumbSchema, glossarySchema } from "@/lib/schema";
import { ogFor } from "@/lib/site";

export const metadata = ogFor(
  "Video Production Glossary",
  "Video production terms explained in plain English, from DoP and colour grading to Foley, versioning and delivery: the Klaxon Studio glossary.",
  "/glossary"
);

/**
 * Terms that name a service we offer link to its page. A reader looking up
 * "colour grading" is one step from wanting it done, and the glossary was the
 * one content page on the site that linked nowhere.
 */
const termServiceSlug: Record<string, string> = {
  "DoP (Director of Photography)": "filming",
  Cinematography: "filming",
  "Pre-Production": "production-management",
  "Post-Production": "editing",
  "Colour Grading": "colour-grading",
  "Sound Design": "sound-design",
  "Sound Mixing": "sound-design",
  "Dialogue Editing": "sound-design",
  Storyboarding: "ideation",
  Scripting: "ideation",
  "Location Scouting": "production-management",
  Permits: "uk-production-services",
  "Multi-Camera Production": "film-crew-hire",
  "Versioning & Delivery": "delivery-versioning",
  "Subtitling & Captioning": "delivery-versioning",
};
const allServices = [...services, ...contentTypes];

export default function GlossaryPage() {
  return (
    <main>
      <JsonLd data={[glossarySchema(glossaryData), breadcrumbSchema([{ name: "Glossary", path: "/glossary" }])]} />
      <section className="pt-[clamp(72px,9vw,128px)] pb-[clamp(40px,5vw,64px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <div className="mb-[clamp(24px,3vw,34px)]">
            <Label>Glossary</Label>
          </div>
          <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[0.98] tracking-[-0.04em]">
            The jargon, explained<span className="text-[var(--brand)]">.</span>
          </h1>
          <p className="mt-[clamp(26px,3vw,36px)] max-w-[52ch] text-[clamp(14px,1.32vw,15.5px)] leading-[1.6] text-[var(--text-secondary)]">
            A plain-English guide to the production terms you&apos;ll come across when you work with us.
          </p>
        </div>
      </section>
      <section className="pb-[clamp(72px,10vw,120px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] border-t border-[var(--border-subtle)]">
          {glossaryData.map((term) => (
            <div
              key={term.t}
              className="grid gap-[clamp(8px,2vw,48px)] py-[clamp(22px,2.8vw,34px)] border-b border-[var(--border-subtle)]"
              style={{ gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))" }}
            >
              <h2 className="font-display font-[var(--kx-dw,700)] text-[clamp(18px,1.9vw,24px)] leading-[1.12] tracking-[-0.02em] m-0">
                {term.t}
              </h2>
              <p className="m-0 max-w-[60ch] text-[clamp(14px,1.32vw,15.5px)] leading-[1.62] text-[var(--text-secondary)]">
                {term.d}
                {(() => {
                  const svc = allServices.find((s) => s.slug === termServiceSlug[term.t]);
                  return svc ? (
                    <>
                      {" "}Related service:{" "}
                      <Link
                        href={svc.href}
                        className="text-[var(--text-primary)] underline underline-offset-[3px] decoration-[var(--brand)] hover:text-[var(--brand)] transition-colors"
                      >
                        {svc.title}
                      </Link>
                      .
                    </>
                  ) : null;
                })()}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
