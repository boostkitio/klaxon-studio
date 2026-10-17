/**
 * Renders one or more JSON-LD blocks. Server component by design, so the markup
 * ships in the static HTML so crawlers that do not execute JavaScript still
 * see it.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Escape "<" so text from the CMS (a post title, an FAQ answer) can
          // never close the script tag early and break the page or the markup.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
