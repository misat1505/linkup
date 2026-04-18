"use server";

import { POSTS_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Post } from "@packages/schemas";

export async function getPost(id: Post["id"]): Promise<Post | null> {
  const api = await serverSideRequestFactory({
    base: POSTS_API,
    include: {
      accessToken: true,
    },
  });

  const response = await api.get(`/${id}`);

  const post = response.data.post;
  if (!post) return null;

  return Post.parse(post);
}
