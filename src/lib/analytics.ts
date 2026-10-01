/**
 * Send an event to GA4.
 *
 * GA is loaded by the plain gtag snippet in SiteChrome, not by the
 * @next/third-parties <GoogleAnalytics> component, so that package's
 * sendGAEvent never initialises and silently drops every event. Queue on
 * dataLayer directly instead: the event survives even if the lazy-loaded tag
 * has not run yet. gtag.js only reads Arguments objects, not arrays, hence
 * the wrapper function.
 */
export function gaEvent(name: string, params: Record<string, string> = {}) {
  const w = window as Window & { dataLayer?: unknown[] };
  const dataLayer = (w.dataLayer = w.dataLayer || []);
  const gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    dataLayer.push(arguments);
  } as (...args: unknown[]) => void;
  gtag("event", name, params);
}
