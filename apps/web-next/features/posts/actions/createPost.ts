"use server";

import { POSTS_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Post } from "@packages/schemas";

export async function createPost(content: Post["content"]): Promise<Post> {
  const api = await serverSideRequestFactory({
    base: POSTS_API,
    include: {
      accessToken: true,
    },
  });

  const response = await api.post("/", { content });
  return Post.parse(response.data.post);
}
