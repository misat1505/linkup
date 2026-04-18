"use server";

import { POSTS_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Post } from "@packages/schemas";

export async function reportPost(postId: Post["id"]): Promise<void> {
  const api = await serverSideRequestFactory({
    base: POSTS_API,
    include: {
      accessToken: true,
    },
  });

  await api.post(`/${postId}/report`);
}
