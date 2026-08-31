import { createClient } from "../supabase/server";

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BlogTag = {
  id: string;
  name: string;
  slug: string;
};

export async function getAdminBlogOptions() {
  const supabase = await createClient();

  const [{ data: categories, error: categoriesError }, { data: tags, error: tagsError }] =
    await Promise.all([
      supabase
        .from("blog_categories")
        .select("id, name, slug")
        .order("name", { ascending: true }),

      supabase
        .from("blog_tags")
        .select("id, name, slug")
        .order("name", { ascending: true }),
    ]);

  if (categoriesError) {
    throw new Error(
      `Failed to load blog categories: ${categoriesError.message}`,
    );
  }

  if (tagsError) {
    throw new Error(
      `Failed to load blog tags: ${tagsError.message}`,
    );
  }

  return {
    categories: (categories ?? []) as BlogCategory[],
    tags: (tags ?? []) as BlogTag[],
  };
}