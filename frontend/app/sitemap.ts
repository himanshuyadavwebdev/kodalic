export const dynamic = "force-dynamic";

import type { MetadataRoute } from "next";
import { getPublicBlogPostsForSitemap } from "../lib/blog/get-public-blog-posts-for-sitemap";
import { getPublicCaseStudies } from "../lib/get-public-case-studies";
import { SITE_URL } from "./seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = ["", "/blog", "/case-studies", "/privacy", "/terms", "/cookies"].map((path) => ({ url: `${SITE_URL}${path}`, lastModified: now }));
  try {
    const [posts, caseStudies] = await Promise.all([getPublicBlogPostsForSitemap(), getPublicCaseStudies()]);
    entries.push(...posts.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: post.updated_at ? new Date(post.updated_at) : post.published_at ? new Date(post.published_at) : now })));
    entries.push(...caseStudies.map((item) => ({ url: `${SITE_URL}/case-studies/${item.slug}`, lastModified: now })));
  } catch (error) {
    console.error("Failed to generate complete sitemap:", error);
  }
  return entries;
}
