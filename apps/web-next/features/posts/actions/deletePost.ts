"use server";

import { POSTS_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Post } from "@packages/schemas";
import { revalidatePath } from "next/cache";

export async function deletePost(id: Post["id"]): Promise<void> {
  const api = await serverSideRequestFactory({
    base: POSTS_API,
    include: {
      accessToken: true,
    },
  });

  await api.delete(`/${id}`);

  revalidatePath("/posts");
}
