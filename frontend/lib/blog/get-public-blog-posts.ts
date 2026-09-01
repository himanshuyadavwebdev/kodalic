import { createClient } from "../supabase/server";

export type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  author_id: string | null;
  status: string;
  published_at: string | null;
  category_id: string | null;
  cover_media_id: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

export async function getPublicBlogPosts(): Promise<PublicBlogPost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("blog_posts")
    .select(`
      id,
      slug,
      title,
      excerpt,
      content,
      author_id,
      status,
      published_at,
      category_id,
      cover_media_id,
      featured,
      created_at,
      updated_at,
      category:blog_categories (
        id,
        name,
        slug
      )
    `)
    .eq("status", "published")
    .not("published_at", "is", null)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(
      `Failed to load public blog posts: ${error.message}`,
    );
  }

  return (data ?? []).map((post) => ({
  ...post,
  category: Array.isArray(post.category)
    ? post.category[0] ?? null
    : post.category ?? null,
})) as PublicBlogPost[];
}