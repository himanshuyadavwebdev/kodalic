import { getPublicBlogPosts } from "../lib/blog/get-public-blog-posts";
import HomeClient from "./home-client";

export default async function Home() {
  const blogPosts = await getPublicBlogPosts();

  return <HomeClient blogPosts={blogPosts} />;
}