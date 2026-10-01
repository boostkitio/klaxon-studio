"use client";

import { useEffect } from "react";
import { gaEvent } from "@/lib/analytics";

const METHODS: [prefix: string, method: string][] = [
  ["tel:", "phone"],
  ["mailto:", "email"],
  ["https://wa.me/", "whatsapp"],
];

/**
 * Reports phone, email and WhatsApp link clicks to GA4 as `contact_click`.
 *
 * The contact form is only one of four ways to enquire, and GA4's enhanced
 * measurement ignores tel: and mailto: links entirely, so anyone who rang or
 * emailed was invisible. One delegated listener covers every such link on the
 * site (footer, contact page, London page) without touching each of them.
 */
export default function ContactClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      const method = METHODS.find(([prefix]) => href.startsWith(prefix))?.[1];
      if (!method) return;
      try {
        gaEvent("contact_click", { method, link_url: href });
      } catch {
        // Analytics must never get in the way of the click itself.
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
