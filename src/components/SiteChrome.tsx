import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { SITE_URL } from "@/lib/site";
import { websiteSchema, siteNavigationSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import ScrollToTop from "@/components/ScrollToTop";
import DisableDraftMode from "@/components/DisableDraftMode";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DESCRIPTION =
  "Klaxon Studio is a full-service video production company in Bermondsey, London, making commercials, branded content, documentary, corporate, social and podcast film for brands that refuse to be ignored.";

// Ties the site to the Klaxon Studio Google Business Profile (hasMap CID)
// so search engines treat them as one entity.
const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  name: "Klaxon Studio",
  description: DESCRIPTION,
  url: SITE_URL,
  telephone: "+44 20 8058 0669",
  email: "hello@klaxon.studio",
  image: `${SITE_URL}/images/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Unit 408, Cocoa Studios, The Biscuit Factory, 100 Drummond Road",
    addressLocality: "London",
    postalCode: "SE16 4FA",
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 51.4943706,
    longitude: -0.0617451,
  },
  hasMap: "https://maps.google.com/?cid=14804452344662294871",
  sameAs: [
    "https://instagram.com/klaxonstudiouk",
    "https://www.linkedin.com/company/klaxon-studio",
  ],
  areaServed: ["London", "South East England", "United Kingdom"],
};

/**
 * Everything the public site wraps around a page: nav, footer, structured
 * data, analytics and the draft-mode preview machinery.
 *
 * This lives beside the root layout rather than in it so that /studio, which
 * shares the same root, renders as a bare Sanity Studio - no site nav bar
 * eating the top of the editor, and no analytics loaded behind it. The global
 * not-found page sits at the root too, so it opts in here explicitly.
 */
export default async function SiteChrome({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraftMode } = await draftMode();
  return (
    <>
      <link rel="preconnect" href="https://image.mux.com" />
      <link rel="preconnect" href="https://i.vimeocdn.com" />
      <JsonLd data={[LOCAL_BUSINESS_JSONLD, websiteSchema(), siteNavigationSchema()]} />
      <ScrollToTop />
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <Analytics />
      <GoogleAnalytics gaId="G-T15XQVQSZG" />
      {/* Keep the preview machinery draft-mode-only so the public
          site stays fully static and the read token never ships to visitors. */}
      {isDraftMode && (
        <>
          <VisualEditing />
          <DisableDraftMode />
        </>
      )}
    </>
  );
}
