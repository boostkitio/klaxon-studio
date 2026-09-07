import Link from "next/link";
import ImageSlot from "@/components/ImageSlot";
import { ogFor } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POSTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { SanityImageSource } from "@sanity/image-url";

import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
export const metadata = ogFor("Blog", "Straight-talking articles on video production from the Klaxon Studio team: budgets, briefs, formats and how to get more from your content.", "/blog");

type PostCard = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  author?: string;
  metaDesc: string;
  lead: string;
  mainImage?: SanityImageSource;
};

export default async function BlogIndexPage() {
  const posts = await sanityFetch<PostCard[]>({ query: POSTS_QUERY, tags: ["post"] });

  return (
    <main>
      <JsonLd data={breadcrumbSchema([{ name: "Blog", path: "/blog" }])} />
      <section className="bg-[var(--brand)] text-white pt-[clamp(72px,9vw,128px)] pb-[clamp(40px,5vw,64px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <span className="inline-flex items-center gap-[11px] font-mono font-medium text-[12px] tracking-[0.12em] uppercase text-white mb-[clamp(24px,3vw,34px)]">
            <span className="w-[4px] h-[1em] bg-white" />
            The journal
          </span>
          <h1 className="font-display font-[var(--kx-dw,700)] text-[clamp(31px,4.5vw,61px)] leading-[0.97] tracking-[-0.04em] text-white">
            Loud Thinking<span className="text-white">.</span>
          </h1>
          <p className="mt-[clamp(26px,3vw,38px)] max-w-[62ch] text-[clamp(15px,1.42vw,17px)] leading-[1.55] text-white/90">
            Honest, specific writing on the parts of video production people usually ask us about directly, budgets,
            briefs, formats, what actually happens on a shoot day. If a client question comes up often enough in a
            phone call, it usually ends up here properly answered instead.
          </p>
        </div>
      </section>

      <section className="pt-[clamp(28px,3.5vw,48px)] pb-[clamp(72px,10vw,120px)]">
        <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
          <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-[clamp(28px,3vw,44px)]">
            {posts.map((post) => (
              <Link key={post._id} href={`/blog/${post.slug}`} className="group flex flex-col no-underline text-inherit">
                <div className="relative aspect-video overflow-hidden bg-[#1A1A1A] mb-[clamp(18px,2vw,24px)]">
                  <div className="absolute inset-0 transition-transform duration-400 group-hover:scale-[1.03]">
                    <ImageSlot
                      src={post.mainImage ? urlFor(post.mainImage).width(800).height(450).url() : undefined}
                      alt={post.title}
                      placeholder="Article image"
                      sizes="(min-width: 640px) 33vw, 100vw"
                    />
                  </div>
                </div>
                <h2 className="font-display font-[var(--kx-dw,700)] text-[clamp(20px,1.95vw,25px)] leading-[1.1] tracking-[-0.02em] mb-3 text-[var(--text-primary)] group-hover:text-[var(--brand)] transition-colors">
                  {post.title}
                </h2>
                <p className="mb-[18px] text-[clamp(14px,1.3vw,15px)] leading-[1.55] text-[var(--text-secondary)]">
                  {post.metaDesc}
                </p>
                <span className="mt-auto inline-flex items-center gap-[9px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[var(--brand)]">
                  Read
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="square"
                    className="transition-transform duration-150 group-hover:translate-x-1"
                  >
                    <path d="M4 12h15" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
