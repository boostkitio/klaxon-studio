import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { stegaClean } from "next-sanity";
import ImageSlot from "@/components/ImageSlot";
import JsonLd from "@/components/JsonLd";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";
import { servicesForPost } from "@/lib/related";
import { serviceHeading } from "@/lib/service-seo";
import { ogFor } from "@/lib/site";
import { client } from "@/sanity/lib/client";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

type Post = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
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

const portableComponents: PortableTextComponents = {
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

  return (
    <main>
      <JsonLd
        data={[
          blogPostingSchema({
            title: cleanTitle,
            description: stegaClean(post.metaDesc) || stegaClean(post.lead),
            slug: stegaClean(post.slug),
            publishedAt: stegaClean(post.publishedAt),
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
                {post.author || "The Klaxon team"}
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
            />
          </div>
        </div>

        <div className="max-w-[820px] mx-auto mt-[clamp(44px,5.5vw,72px)] px-[clamp(20px,5vw,48px)] flex flex-col gap-[clamp(20px,2.4vw,28px)]">
          <PortableText value={post.body} components={portableComponents} />
        </div>

        {relatedServices.length > 0 && (
          <div className="max-w-[820px] mx-auto mt-[clamp(48px,6vw,80px)] px-[clamp(20px,5vw,48px)]">
            <div className="border-t border-[var(--border-subtle)] pt-[clamp(32px,4vw,48px)]">
              <span className="flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-[clamp(18px,2.2vw,26px)]">
                <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
                How we can help
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-[clamp(20px,3vw,32px)]">
                {relatedServices.map((svc) => (
                  <Link
                    key={svc.slug}
                    href={svc.href}
                    className="group block border-t border-[var(--border-subtle)] py-[15px] transition-colors hover:border-[var(--brand)]"
                  >
                    <span className="block font-display font-[var(--kx-dw,700)] text-[clamp(15px,1.5vw,18px)] leading-[1.2] tracking-[-0.02em] transition-colors group-hover:text-[var(--brand)]">
                      {serviceHeading(svc)}
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
