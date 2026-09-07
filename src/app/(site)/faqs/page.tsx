import Label from "@/components/ui/Label";
import FaqAccordion from "@/components/FaqAccordion";
import JsonLd from "@/components/JsonLd";
import { faqsData } from "@/lib/content";
import { faqPageSchema, breadcrumbSchema } from "@/lib/schema";
import { ogFor } from "@/lib/site";

const TITLE = "Video Production FAQs | Klaxon Studio London";

export const metadata = {
  ...ogFor(TITLE, "Answers to the questions we are asked most about video production: process, budgets, timelines, deliverables and working with Klaxon Studio.", "/faqs"),
  title: { absolute: TITLE },
};

export default function FaqsPage() {
  const allFaqs = faqsData.sections.flatMap((s) => s.qas);
  return (
    <main>
      <JsonLd
        data={[
          faqPageSchema(allFaqs),
          breadcrumbSchema([{ name: "FAQs", path: "/faqs" }]),
        ]}
      />
      <section className="pt-[clamp(72px,9vw,128px)] pb-[clamp(36px,4.5vw,56px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <div className="mb-[clamp(24px,3vw,34px)]">
            <Label>Help &amp; answers</Label>
          </div>
          <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[0.98] tracking-[-0.04em] max-w-[18ch]">
            {faqsData.lead}
          </h1>
          <p className="mt-[clamp(26px,3vw,36px)] max-w-[60ch] text-[clamp(14px,1.32vw,15.5px)] leading-[1.6] text-[var(--text-secondary)]">
            {faqsData.intro}
          </p>
        </div>
      </section>

      <section data-faq-end="1" className="bg-[var(--brand)] text-white pt-[clamp(48px,6vw,80px)] pb-[clamp(64px,8vw,112px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)] flex flex-col gap-[clamp(44px,5.5vw,72px)]">
          {faqsData.sections.map((grp) => (
            <div key={grp.heading}>
              <span className="block font-mono font-medium text-[11px] tracking-[0.14em] uppercase text-white/78 mb-[clamp(14px,1.6vw,20px)]">
                {grp.heading}
              </span>
              <FaqAccordion items={grp.qas} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
