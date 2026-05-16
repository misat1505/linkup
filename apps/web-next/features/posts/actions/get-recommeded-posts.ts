"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { Post } from "@packages/schemas";
import { PostWithRenderedContent } from "../schemas/post-with-rendered-content";
import { getCachedRenderedPost } from "../utils/render-post";
import { sortPosts } from "../utils/sort-posts";

export async function getRecommendedPosts(
  lastPostId: Post["id"] | null,
  limit: number,
): Promise<PostWithRenderedContent[]> {
  const res = await apiContractClient.getPosts({
    query: { lastPostId, limit },
  });

  const sortedPosts = sortPosts(res.posts);

  const renderedPosts = await Promise.all(
    sortedPosts.map((post) => getCachedRenderedPost(post)),
  );

  return renderedPosts;
}
