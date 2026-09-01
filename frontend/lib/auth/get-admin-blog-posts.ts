import { createClient } from "../supabase/server";

export type AdminBlogPost = {
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
};

export async function getAdminBlogPosts(): Promise<AdminBlogPost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc(
    "get_admin_blog_posts",
  );

  if (error) {
    throw new Error(
      `Failed to load admin blog posts: ${error.message}`,
    );
  }

  return (data ?? []) as AdminBlogPost[];
}