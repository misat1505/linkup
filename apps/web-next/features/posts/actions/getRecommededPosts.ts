"use server";

import { apiContractClient } from "@/lib/apiQueryClient";
import { Post } from "@packages/schemas";
import { PostWithRenderedContent } from "../schemas/post-with-rendered-content";
import { getCachedRenderedPost } from "../utils/renderPost";
import { sortPosts } from "../utils/sortPosts";

export async function getRecommendedPosts(
  lastPostId: Post["id"] | null,
  limit: number,
): Promise<PostWithRenderedContent[]> {
  console.log(
    `Getting recommended posts ${JSON.stringify({ lastPostId, limit })}`,
  );
  const res = await apiContractClient.getPosts({
    query: { lastPostId, limit },
  });

  const sortedPosts = sortPosts(res.posts);

  const renderedPosts = await Promise.all(
    sortedPosts.map((post) => getCachedRenderedPost(post)),
  );

  return renderedPosts;
}
