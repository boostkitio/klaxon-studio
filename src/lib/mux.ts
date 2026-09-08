/**
 * Mux playback IDs sit between the host and the filename in a stream URL:
 * https://stream.mux.com/<PLAYBACK_ID>/highest.mp4
 */
export function muxPlaybackId(videoUrl: string): string | undefined {
  return /stream\.mux\.com\/([^/]+)\//.exec(videoUrl)?.[1];
}

/**
 * Poster frame for a loop. Matches the 0.1s seek the hover player uses, so
 * the still and the paused video show the same frame and there is no jump
 * when the video mounts.
 *
 * Requires https://image.mux.com in the CSP img-src directive.
 */
export function muxThumbnail(videoUrl: string, width?: number): string | undefined {
  const id = muxPlaybackId(videoUrl);
  if (!id) return undefined;
  const params = new URLSearchParams({ time: "0.1" });
  if (width) params.set("width", String(width));
  return `https://image.mux.com/${id}/thumbnail.webp?${params}`;
}

/** Widths cover a tile from single-column mobile up to a 2x DPR desktop tile. */
const THUMB_WIDTHS = [400, 640, 960, 1280];
const HERO_WIDTHS = [720, 1080, 1440];

export function muxThumbnailSrcSet(videoUrl: string): string | undefined {
  if (!muxPlaybackId(videoUrl)) return undefined;
  return THUMB_WIDTHS.map((w) => `${muxThumbnail(videoUrl, w)} ${w}w`).join(", ");
}

export function muxHeroPosterSrcSet(videoUrl: string): string | undefined {
  if (!muxPlaybackId(videoUrl)) return undefined;
  return HERO_WIDTHS.map((w) => `${muxThumbnail(videoUrl, w)} ${w}w`).join(", ");
}
