import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { draftMode } from "next/headers";
import { businessSchema, websiteSchema, siteNavigationSchema } from "@/lib/schema";
import JsonLd from "@/components/JsonLd";
import ScrollToTop from "@/components/ScrollToTop";
import DraftModePreview from "@/components/DraftModePreview";
import ContactClickTracker from "@/components/ContactClickTracker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <JsonLd data={[businessSchema(), websiteSchema(), siteNavigationSchema()]} />
      <ScrollToTop />
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <Analytics />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-T15XQVQSZG"
        strategy="lazyOnload"
      />
      <Script id="ga-gtag" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-T15XQVQSZG');`}
      </Script>
      <ContactClickTracker />
      {/* Keep the preview machinery draft-mode-only so the public
          site stays fully static and the read token never ships to visitors. */}
      {isDraftMode && <DraftModePreview />}
    </>
  );
}
