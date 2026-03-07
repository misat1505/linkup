"use server";

import { Post } from "@/features/posts/schemas/post";
import { POSTS_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";

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
