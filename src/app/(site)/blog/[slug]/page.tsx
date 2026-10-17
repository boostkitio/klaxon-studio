import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { stegaClean } from "next-sanity";
import ImageSlot from "@/components/ImageSlot";
import JsonLd from "@/components/JsonLd";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { servicesForPost, relatedPostSlugsForPost } from "@/lib/related";
import { founders } from "@/lib/content";
import { ogFor, SITE_URL } from "@/lib/site";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POST_QUERY, POST_SLUGS_QUERY, POST_TITLES_BY_SLUGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

type Post = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  metaDesc: string;
  lead: string;
  mainImage?: SanityImageSource;
  body: PortableTextBlock[];
};

export async function generateStaticParams() {
  const slugs = await client
    .withConfig({ useCdn: false, stega: false })
    .fetch<{ slug: string }[]>(
      POST_SLUGS_QUERY,
      {},
      { token: process.env.SANITY_API_READ_TOKEN, perspective: "published" }
    );
  return slugs;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client
    .withConfig({ stega: false })
    .fetch<Post | null>(POST_QUERY, { slug }, { token: process.env.SANITY_API_READ_TOKEN, perspective: "published" });
  if (!post) return {};
  // Descriptions are written in the Studio with no length limit. Past ~160
  // characters Google cuts them mid-word, so trim at the last whole word.
  const description =
    post.metaDesc.length > 160
      ? `${post.metaDesc.slice(0, 157).replace(/\s+\S*$/, "")}...`
      : post.metaDesc;
  const meta = ogFor(post.title, description, `/blog/${post.slug}`);
  // Same rule as the case studies: drop the " | Klaxon Studio" suffix where
  // it would push the title past the ~60 characters Google shows.
  return `${post.title} | Klaxon Studio`.length > 60 ? { ...meta, title: { absolute: post.title } } : meta;
}

const inlineLink =
  "text-[var(--text-primary)] underline underline-offset-[3px] decoration-[var(--brand)] hover:text-[var(--brand)] transition-colors";

/** Absolute links to this site, written that way in the Studio, become relative. */
const toInternalPath = (href: string) => {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href.startsWith(SITE_URL)) return href.slice(SITE_URL.length) || "/";
  return null;
};

const portableComponents: PortableTextComponents = {
  marks: {
    // Internal links stay in the tab and go through the router. External
    // sources open in a new tab so a reader checking a citation keeps the
    // article; noopener stops the new page reaching back into this one.
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href.trim() : "";
      if (!href) return <>{children}</>;
      const internal = toInternalPath(href);
      if (internal) {
        return (
          <Link href={internal} className={inlineLink}>
            {children}
          </Link>
        );
      }
      return (
        <a href={href} target="_blank" rel="noopener" className={inlineLink}>
          {children}
        </a>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="font-display font-[var(--kx-dw,700)] text-[clamp(21px,2.4vw,30px)] leading-[1.12] tracking-[-0.025em] mt-[clamp(16px,2vw,24px)]">
        {children}
      </h2>
    ),
    normal: ({ children }) => (
      <p className="text-[clamp(15px,1.5vw,17px)] leading-[1.68] text-[var(--text-secondary)]">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 flex flex-col gap-3 text-[clamp(15px,1.5vw,17px)] leading-[1.68] text-[var(--text-secondary)]">
        {children}
      </ul>
    ),
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<Post | null>({
    query: POST_QUERY,
    params: { slug },
    tags: [`post:${slug}`, "post"],
  });
  if (!post) notFound();

  const cleanTitle = stegaClean(post.title);
  // Keyed off the route slug rather than post.slug: in draft mode post.slug
  // carries stega markers, which would never match the plain map keys.
  const relatedServices = servicesForPost(slug);
  const relatedSlugs = relatedPostSlugsForPost(slug);
  const fetchedRelated = relatedSlugs.length
    ? await sanityFetch<{ slug: string; title: string }[]>({
        query: POST_TITLES_BY_SLUGS_QUERY,
        params: { slugs: relatedSlugs },
        tags: ["post"],
      })
    : [];
  const relatedPosts = relatedSlugs
    .map((s) => fetchedRelated.find((p) => p.slug === s))
    .filter((p): p is { slug: string; title: string } => Boolean(p));
  const authorIsFounder = founders.some((f) => f.fullName === stegaClean(post.author));

  return (
    <main>
      <JsonLd
        data={[
          blogPostingSchema({
            title: cleanTitle,
            description: stegaClean(post.metaDesc) || stegaClean(post.lead),
            slug: stegaClean(post.slug),
            publishedAt: stegaClean(post.publishedAt),
            updatedAt: post.updatedAt,
            author: stegaClean(post.author) || undefined,
            imageUrl: post.mainImage
              ? urlFor(post.mainImage).width(1200).height(630).url()
              : undefined,
          }),
          breadcrumbSchema([
            { name: "Blog", path: "/blog" },
            { name: cleanTitle, path: `/blog/${stegaClean(post.slug)}` },
          ]),
        ]}
      />
      <article className="pb-[clamp(64px,8vw,112px)]">
        <section className="bg-[var(--brand)] text-white pt-[clamp(48px,6vw,88px)] pb-[clamp(52px,6.5vw,96px)]">
          <div className="max-w-[1080px] mx-auto px-[clamp(20px,5vw,48px)]">
            <div className="min-w-0 max-w-[62ch]">
              <Link
                href="/blog"
                className="inline-flex items-center gap-[9px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-white/82 hover:text-white transition-colors mb-[clamp(26px,3.4vw,40px)]"
              >
                <span className="inline-flex rotate-180">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square">
                    <path d="M4 12h15" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </span>
                Loud Thinking
              </Link>
              <span className="block font-mono font-medium text-[11px] tracking-[0.14em] uppercase text-white/75 mb-[clamp(18px,2vw,24px)]">
                {authorIsFounder ? (
                  <Link href="/about" className="hover:text-white transition-colors">
                    {post.author}
                  </Link>
                ) : (
                  post.author || "The Klaxon team"
                )}
              </span>
              <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[1.0] tracking-[-0.035em] text-white">
                {post.title}
              </h1>
              <p className="mt-[clamp(22px,2.8vw,32px)] font-display font-[var(--kx-dw,700)] text-[clamp(18px,2vw,24px)] leading-[1.28] tracking-[-0.015em] text-white">
                {post.lead}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-[820px] mx-auto mt-[clamp(40px,5vw,64px)] px-[clamp(20px,5vw,48px)]">
          <div className="relative w-full aspect-[21/9] min-h-[240px] overflow-hidden bg-[#1A1A1A]">
            <ImageSlot
              src={post.mainImage ? urlFor(post.mainImage).width(1640).height(703).url() : undefined}
              alt={post.title}
              placeholder="Article image"
              sizes="(min-width: 880px) 820px, 100vw"
              // The article image is the LCP element; lazy loading it cost
              // a 7.2s mobile LCP in Lighthouse.
              preload
            />
          </div>
        </div>

        <div className="max-w-[820px] mx-auto mt-[clamp(44px,5.5vw,72px)] px-[clamp(20px,5vw,48px)] flex flex-col gap-[clamp(20px,2.4vw,28px)]">
          <PortableText value={post.body} components={portableComponents} />
        </div>

        {relatedServices.length > 0 && (
          <div className="max-w-[820px] mx-auto mt-[clamp(48px,6vw,80px)] px-[clamp(20px,5vw,48px)]">
            <div className="border-t border-[var(--border-subtle)] pt-[clamp(32px,4vw,48px)]">
              <h2 className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-[clamp(18px,2.2vw,26px)]">
                <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
                How we can help
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-[clamp(20px,3vw,32px)]">
                {relatedServices.map((svc) => (
                  <Link
                    key={svc.slug}
                    href={svc.href}
                    className="group block border-t border-[var(--border-subtle)] py-[15px] transition-colors hover:border-[var(--brand)]"
                  >
                    <span className="block font-display font-[var(--kx-dw,700)] text-[clamp(15px,1.5vw,18px)] leading-[1.2] tracking-[-0.02em] transition-colors group-hover:text-[var(--brand)]">
                      {svc.title}
                    </span>
                    <span className="block mt-[6px] font-mono font-medium text-[10px] tracking-[0.1em] uppercase text-[var(--text-muted)]">
                      {svc.desc}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {relatedPosts.length > 0 && (
          <div className="max-w-[820px] mx-auto mt-[clamp(48px,6vw,80px)] px-[clamp(20px,5vw,48px)]">
            <div className="border-t border-[var(--border-subtle)] pt-[clamp(32px,4vw,48px)]">
              <h2 className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-[clamp(18px,2.2vw,26px)]">
                <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
                Related reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-[clamp(20px,3vw,32px)]">
                {relatedPosts.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/blog/${p.slug}`}
                    className="group block border-t border-[var(--border-subtle)] py-[15px] transition-colors hover:border-[var(--brand)]"
                  >
                    <span className="block font-display font-[var(--kx-dw,700)] text-[clamp(15px,1.5vw,18px)] leading-[1.2] tracking-[-0.02em] transition-colors group-hover:text-[var(--brand)]">
                      {p.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-[820px] mx-auto mt-[clamp(48px,6vw,80px)] px-[clamp(20px,5vw,48px)]">
          <div className="border-t border-[var(--border-subtle)] pt-[clamp(32px,4vw,48px)]">
            <Link
              href="/blog"
              className="inline-flex items-center justify-center gap-[10px] px-[24px] py-[14px] bg-transparent text-[var(--brand)] border border-[var(--brand)] font-mono font-medium text-[12px] tracking-[0.12em] uppercase cursor-pointer transition-colors hover:bg-[var(--brand)] hover:text-white"
            >
              <span className="inline-flex rotate-180">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="square">
                  <path d="M4 12h15" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </span>
              Back to Loud Thinking
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
