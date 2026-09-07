import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { ogFor } from "@/lib/site";

const TITLE = "Contact Klaxon Studio | Video Production Company London";

export const metadata = {
  ...ogFor(
    TITLE,
    "Got a brief, a budget or just the bones of an idea? Get in touch with Klaxon Studio, London. We reply within one working day.",
    "/contact"
  ),
  title: { absolute: TITLE },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Contact", path: "/contact" }])} />
      {children}
    </>
  );
}
