/**
 * Vimeo's CDN encodes the thumbnail's size directly in the URL as
 * `-d_<width>x<height>`, and honours a different one requested on the same
 * path - swapping it out gives us free responsive variants without a second
 * API call. Confirmed against a real thumbnail URL: requesting a smaller
 * width returns a genuinely smaller file, and the CDN content-negotiates to
 * WebP for any client that sends an `Accept: image/webp` header (every
 * browser that matters does), so no explicit format handling is needed here.
 */
const THUMB_WIDTHS = [400, 640, 800, 960];

export function vimeoThumbnailSrcSet(vimeoThumb: string | undefined): string | undefined {
  if (!vimeoThumb) return undefined;
  const match = vimeoThumb.match(/-d_(\d+)x(\d+)/);
  if (!match) return undefined;
  const [, widthStr, heightStr] = match;
  const originalWidth = Number(widthStr);
  const originalHeight = Number(heightStr);

  return THUMB_WIDTHS.filter((w) => w <= originalWidth)
    .map((w) => {
      const h = Math.round((originalHeight / originalWidth) * w);
      const url = vimeoThumb.replace(/-d_\d+x\d+/, `-d_${w}x${h}`);
      return `${url} ${w}w`;
    })
    .join(", ");
}

/**
 * A handful of stills (the showreel poster) come from Vimeo's oEmbed API
 * as a `?mw=<width>` URL instead of the `-d_<w>x<h>` path shape above -
 * same CDN, same resize-by-swapping-the-param trick, same free WebP
 * negotiation, just a different query string. No aspect ratio to preserve
 * here since mw is a max-width-only request (Vimeo returns whatever
 * height keeps the source's own aspect).
 */
const POSTER_WIDTHS = [400, 640, 800];

export function vimeoPosterSrcSet(poster: string | undefined): string | undefined {
  if (!poster) return undefined;
  const match = poster.match(/[?&]mw=(\d+)/);
  if (!match) return undefined;
  const originalWidth = Number(match[1]);

  return POSTER_WIDTHS.filter((w) => w <= originalWidth)
    .map((w) => `${poster.replace(/mw=\d+/, `mw=${w}`)} ${w}w`)
    .join(", ");
}
