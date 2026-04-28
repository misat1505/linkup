"use server";

import { apiContractClient } from "@/lib/apiQueryClient";
import { Post } from "@packages/schemas";

export async function createPost(content: Post["content"]): Promise<Post> {
  const res = await apiContractClient.createPost({
    body: { content },
  });
  return res.post;
}
