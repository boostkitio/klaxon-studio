import Link from "next/link";
import type { ServiceDetail, Project } from "@/lib/content";

type PostLink = { slug: string; title: string };

export const columnLabel =
  "flex items-center gap-[11px] font-mono font-medium text-[11px] tracking-[0.12em] uppercase text-[var(--text-muted)] mb-[clamp(18px,2.2vw,26px)]";

export const itemLink =
  "group block border-t border-[var(--border-subtle)] py-[15px] transition-colors hover:border-[var(--brand)]";

export const itemTitle =
  "block font-display font-[var(--kx-dw,700)] text-[clamp(15px,1.5vw,18px)] leading-[1.2] tracking-[-0.02em] transition-colors group-hover:text-[var(--brand)]";

export const itemMeta =
  "block mt-[6px] font-mono font-medium text-[10px] tracking-[0.1em] uppercase text-[var(--text-muted)]";

/**
 * The internal-link block on a service or case study page: proof (case
 * studies), sideways moves (sibling services) and supporting reading (blog
 * posts). Case study pages pass no posts.
 *
 * Sits above the FAQ section so the links are inside the main content flow
 * rather than stranded in the footer — footer links are sitewide boilerplate
 * and carry far less weight than an in-content link.
 */
export default function RelatedLinks({
  services,
  projects,
  posts,
}: {
  services: ServiceDetail[];
  projects: Project[];
  posts: PostLink[];
}) {
  const columns = [services, projects, posts].filter((c) => c.length > 0).length;
  if (!columns) return null;

  return (
    <section className="pt-[clamp(40px,5vw,72px)] pb-[clamp(48px,6vw,80px)]">
      <div className="max-w-[1280px] mx-auto px-[clamp(20px,5vw,48px)]">
        <div className={`grid grid-cols-1 ${columns === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-[clamp(32px,4vw,56px)]`}>
          {projects.length > 0 && (
            <div className="min-w-0">
              <span className={columnLabel}>
                <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
                Selected work
              </span>
              {projects.map((p) => (
                <Link key={p.id} href={p.href} className={itemLink}>
                  <span className={itemTitle}>{p.client}</span>
                  <span className={itemMeta}>{p.title}</span>
                </Link>
              ))}
            </div>
          )}

          {services.length > 0 && (
            <div className="min-w-0">
              <span className={columnLabel}>
                <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
                Related services
              </span>
              {services.map((s) => (
                <Link key={s.slug} href={s.href} className={itemLink}>
                  <span className={itemTitle}>{s.title}</span>
                  <span className={itemMeta}>{s.desc}</span>
                </Link>
              ))}
            </div>
          )}

          {posts.length > 0 && (
            <div className="min-w-0">
              <span className={columnLabel}>
                <span className="w-[4px] h-[1em] bg-[var(--brand)]" />
                Related reading
              </span>
              {posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className={itemLink}>
                  <span className={itemTitle}>{p.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
