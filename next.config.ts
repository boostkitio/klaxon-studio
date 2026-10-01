import type { NextConfig } from "next";
import withBundleAnalyzerInit from "@next/bundle-analyzer";

const withBundleAnalyzer = withBundleAnalyzerInit({ enabled: process.env.ANALYZE === "true" });

// Old WordPress work slugs that have no matching page on the new site.
const retiredWorkSlugs = [
  "state-of-european-tech",
  "roche",
  "elsevier-roundtable",
  "elsevier",
  "blackford",
  "atomico",
  "accurx",
  "livemore-customer-case-study",
  "showreel",
  "galderma-social-video-content",
  "ciklum",
];

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

// Covers every third party the public site touches: GA4 (via
// @next/third-parties, which injects an inline bootstrap script — hence
// 'unsafe-inline' in script-src; Next's own hydration scripts need it too),
// the Vimeo showreel player, Mux MP4 loops, Sanity's image CDN, and the
// Google Business Profile map embed on /contact. The /studio route is
// excluded below: Sanity Studio is a full SPA with its own third-party
// surface, and a policy tight enough to be worth having breaks it.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://player.vimeo.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://i.vimeocdn.com https://image.mux.com https://*.googletagmanager.com https://*.google-analytics.com",
  "font-src 'self'",
  "media-src 'self' blob: https://stream.mux.com",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://stream.mux.com",
  "frame-src https://player.vimeo.com https://www.google.com https://maps.google.com",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

// The one directive Studio does need. The Sanity dashboard embeds the
// self-hosted Studio in an iframe, so sanity.io has to be an allowed frame
// ancestor.
//
// Clickjacking protection is CSP frame-ancestors throughout - see the "self"
// entry in the site policy above - and X-Frame-Options is deliberately absent
// site-wide. It cannot name a third-party origin, browsers that honour it
// would override frame-ancestors, and the Sanity dashboard refuses to embed a
// studio whose host sends it at all, root included.
const studioCsp = "frame-ancestors 'self' https://www.sanity.io https://sanity.io";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  experimental: {
    // Tailwind's whole compiled stylesheet is ~12KB - small enough that
    // inlining it removes a render-blocking request for every first-time
    // visitor without meaningfully bloating the HTML. style-src already
    // allows 'unsafe-inline' above, so this doesn't touch the CSP.
    inlineCss: true,
  },
  // Next would otherwise strip a trailing slash with its own 308 before any
  // rule below runs, so every old WordPress URL (they all ended in a slash)
  // took two hops to arrive. With that off, the rules below handle the slash
  // themselves: legacy URLs go straight to their destination, and the final
  // rule strips the slash from everything else, as Next did.
  skipTrailingSlashRedirect: true,
  async redirects() {
    const legacy = [
      // Old WordPress page URLs
      { source: "/sitemap_index.xml", destination: "/sitemap.xml" },
      { source: "/about-us", destination: "/about" },
      { source: "/contact-us", destination: "/contact" },
      { source: "/our-work-showreel", destination: "/work" },
      { source: "/healthcare-video-production", destination: "/services/health-sector" },
      { source: "/terms-conditions", destination: "/terms" },
      { source: "/cookie-notice", destination: "/privacy-policy" },
      { source: "/temp-title-post", destination: "/" },
      { source: "/template-format", destination: "/" },
      // Retired case studies go to the work index (must precede the generic rule)
      ...retiredWorkSlugs.map((slug) => ({ source: `/our-work/${slug}`, destination: "/work" })),
      // Everything else maps 1:1 — new work slugs deliberately reuse the old ones
      { source: "/our-work/:slug", destination: "/work/:slug" },
      { source: "/our-work", destination: "/work" },
    ];
    return [
      // Vercel serves production on this default alias as well as on
      // klaxon.studio. It is public and crawlable, so send it to the real
      // domain rather than leave a second copy of the site in Google's reach.
      {
        source: "/:path*",
        has: [{ type: "host", value: "klaxon-studio-site-two.vercel.app" }],
        destination: "https://klaxon.studio/:path*",
        permanent: true,
      },
      // Each legacy rule twice: with the trailing slash WordPress used, and without.
      ...legacy.flatMap(({ source, destination }) => [
        { source: `${source}/`, destination, permanent: true },
        { source, destination, permanent: true },
      ]),
      { source: "/category/:slug*", destination: "/blog", permanent: true },
      // Trailing slash on any other path: strip it.
      { source: "/:path(.+)/", destination: "/:path", permanent: true },
    ];
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // Full CSP everywhere except the Sanity Studio SPA (and its draft-mode
      // machinery, which runs under the same /studio path prefix).
      {
        source: "/((?!studio).*)",
        headers: [{ key: "Content-Security-Policy", value: csp }],
      },
      { source: "/studio", headers: [{ key: "Content-Security-Policy", value: studioCsp }] },
      { source: "/studio/:path*", headers: [{ key: "Content-Security-Policy", value: studioCsp }] },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
