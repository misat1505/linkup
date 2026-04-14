"use server";

import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Post } from "../schemas/post";
import { POSTS_API } from "@/utils/api";

export async function reportPost(postId: Post["id"]): Promise<void> {
  const api = await serverSideRequestFactory({
    base: POSTS_API,
    include: {
      accessToken: true,
    },
  });

  await api.post(`/${postId}/report`);
}
