"use server";

import { POSTS_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Post } from "@packages/schemas";
import z from "zod";
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
  const params = new URLSearchParams();
  params.set("lastPostId", lastPostId || "null");
  params.set("limit", limit.toString());

  const api = await serverSideRequestFactory({
    base: POSTS_API,
    include: {
      accessToken: true,
    },
  });

  const response = await api.get("/", { params });

  const posts = z.array(Post).parse(response.data.posts);

  const sortedPosts = sortPosts(posts);

  const renderedPosts = await Promise.all(
    sortedPosts.map((post) => getCachedRenderedPost(post)),
  );

  return renderedPosts;
}
