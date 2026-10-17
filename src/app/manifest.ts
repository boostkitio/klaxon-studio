import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

// Gives browsers the brand name and icon when the site is pinned or saved to
// a home screen, so returning visitors land straight on klaxon.studio.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Klaxon",
    description: "Video production company in Bermondsey, London.",
    start_url: "/",
    display: "browser",
    background_color: "#ECEBE9",
    theme_color: "#ECEBE9",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
