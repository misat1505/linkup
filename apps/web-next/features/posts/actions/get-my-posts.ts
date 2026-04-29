"use server";
import { apiContractClient } from "@/lib/api-query-client";
import { PostWithRenderedContent } from "../schemas/post-with-rendered-content";
import { getCachedRenderedPost } from "../utils/render-post";
import { sortPosts } from "../utils/sort-posts";

export async function getMyPosts(): Promise<PostWithRenderedContent[]> {
  const res = await apiContractClient.getUserPosts();

  const sortedPosts = sortPosts(res.posts);

  const renderedPosts = await Promise.all(
    sortedPosts.map((post) => getCachedRenderedPost(post)),
  );

  return renderedPosts;
}
