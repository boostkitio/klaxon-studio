import type { Metadata } from "next";
import localFont from "next/font/local";
import { SITE_URL, OG_BASE } from "@/lib/site";
import "./globals.css";

// Latin-only woff2 files from Fontsource (@fontsource/inter and
// @fontsource/jetbrains-mono 5.3.0), the same weights and normal style
// previously requested from next/font/google. Kept in the repo so the
// build does not fetch Google Fonts. OFL licences sit beside the files.
const inter = localFont({
  src: [
    { path: "./fonts/inter/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/inter/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/inter/inter-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/inter/inter-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  adjustFontFallback: "Arial",
});

const jetbrainsMono = localFont({
  src: [
    {
      path: "./fonts/jetbrains-mono/jetbrains-mono-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/jetbrains-mono/jetbrains-mono-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
  adjustFontFallback: "Arial",
});

const DESCRIPTION =
  "Klaxon Studio is a full-service video production company in Bermondsey, London, making commercials, branded content, documentary, corporate, social and podcast film for brands that refuse to be ignored.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Klaxon Studio | Video Production Company London",
    template: "%s | Klaxon Studio",
  },
  description: DESCRIPTION,
  openGraph: {
    ...OG_BASE,
    title: "Klaxon Studio | Video Production Company London",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Klaxon Studio | Video Production Company London",
    description: DESCRIPTION,
  },
};

// Deliberately thin: html, body and fonts only. The site's nav, footer,
// structured data and analytics live in SiteChrome, which the (site) route
// group and the not-found page pull in - so /studio, which shares this root,
// renders as a bare Sanity Studio.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
