import { ogFor } from "@/lib/site";

export const metadata = ogFor(
  "Privacy Policy",
  "How Klaxon Studio collects, uses and protects your personal data, including contact form submissions, analytics and cookies.",
  "/privacy-policy"
);

const sections: { heading: string; items: string[] }[] = [
  {
    heading: "Who we are",
    items: [
      "Klaxon Studio is a video production company based at Cocoa Studios, The Biscuit Factory, 100 Drummond Road, London SE16 4FA. Our website address is https://klaxon.studio. If you have any questions about this policy or how we handle your data, email us at hello@klaxon.studio.",
    ],
  },
  {
    heading: "What data we collect",
    items: [
      "Contact form: when you send us an enquiry through this website we collect your name, email address, company name (if provided) and the message you write. We use this information solely to respond to your enquiry and to discuss your project with you.",
      "Email and phone: if you contact us directly by email, phone or WhatsApp, we hold the correspondence and contact details you share with us for as long as needed to deal with your enquiry and any work that follows.",
      "Analytics: we use privacy-friendly, cookieless analytics (Vercel Web Analytics) to understand how the site is used - pages visited, referrers, country, and device type. This data is aggregated and anonymised; it does not identify you and no advertising or cross-site tracking profiles are built.",
    ],
  },
  {
    heading: "How your data is processed",
    items: [
      "Contact form submissions are delivered to us by email via Resend, our email delivery provider, and are protected in transit. We do not sell, rent or trade your personal data with any third party, and we do not use it for marketing you have not asked for.",
      "This website is hosted on Vercel. Like most hosting providers, Vercel processes standard server logs (such as IP addresses) for security and to operate the service.",
    ],
  },
  {
    heading: "Cookies",
    items: [
      "This site does not set advertising or tracking cookies. Our analytics are cookieless.",
      "Embedded content on some pages - Vimeo video players and Google Maps - may set their own cookies when you interact with it. That content behaves exactly as if you had visited vimeo.com or google.com directly, and those services' own privacy policies apply to it.",
    ],
  },
  {
    heading: "How long we keep your data",
    items: [
      "We keep enquiry correspondence for as long as reasonably necessary to handle your enquiry and any subsequent project, and to meet our legal and accounting obligations. We review and delete data we no longer need.",
    ],
  },
  {
    heading: "Your rights",
    items: [
      "Under UK data protection law (UK GDPR and the Data Protection Act 2018) you have the right to request access to the personal data we hold about you, to ask for it to be corrected or erased, to object to or restrict our processing of it, and to data portability.",
      "To exercise any of these rights, email hello@klaxon.studio. You also have the right to lodge a complaint with the Information Commissioner's Office (ICO) at ico.org.uk.",
    ],
  },
  {
    heading: "Changes to this policy",
    items: [
      "We may update this policy from time to time to reflect changes to the website or the law. The latest version will always be published on this page.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main>
      <section className="bg-[var(--brand)] text-white pt-[clamp(72px,9vw,128px)] pb-[clamp(56px,7vw,96px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="inline-flex items-center gap-[11px] font-mono font-medium text-[12px] tracking-[0.12em] uppercase text-white mb-[clamp(28px,4vw,44px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            Privacy Policy
          </span>
          <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[0.98] tracking-[-0.04em] max-w-[20ch] text-white">
            Your data, handled properly
          </h1>
          <span className="block mt-[clamp(28px,3.4vw,42px)] font-mono font-medium text-[11px] tracking-[0.14em] uppercase text-white/82">
            Last updated July 2026
          </span>
        </div>
      </section>
      <section className="pt-[clamp(56px,7vw,104px)] pb-[clamp(72px,10vw,120px)]">
        <div className="max-w-[920px] mx-auto px-[clamp(20px,5vw,48px)] flex flex-col gap-[clamp(44px,5vw,72px)]">
          {sections.map((sec) => (
            <div key={sec.heading} className="flex flex-col gap-[clamp(14px,1.6vw,18px)]">
              <h2 className="font-display font-[var(--kx-dw,700)] text-[clamp(20px,2.2vw,28px)] leading-[1.1] tracking-[-0.025em] m-0 mb-1 pb-[clamp(14px,1.6vw,18px)] border-b border-[var(--border-subtle)]">
                {sec.heading}
              </h2>
              {sec.items.map((clause, i) => (
                <p key={i} className="m-0 text-[clamp(14px,1.32vw,15.5px)] leading-[1.68] text-[var(--text-secondary)]">
                  {clause}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
