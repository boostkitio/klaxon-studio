import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    author,
    metaDesc,
    lead,
    mainImage
  }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    author,
    metaDesc,
    lead,
    mainImage,
    body
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{ "slug": slug.current, "updatedAt": _updatedAt }
`);

export const CLIENT_LOGOS_QUERY = defineQuery(`
  *[_type == "clientLogo"] | order(order asc) {
    _id,
    name,
    logo,
    scale
  }
`);

/** Titles for a known set of post slugs — used by the service pages' related-reading block. */
export const POST_TITLES_BY_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && slug.current in $slugs]{
    title,
    "slug": slug.current
  }
`);
