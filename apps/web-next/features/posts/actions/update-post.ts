"use server";
import { apiContractClient } from "@/lib/api-query-client";
import { Post } from "@packages/schemas";
import { revalidateTag } from "next/cache";

export async function updatePost({
  id,
  content,
}: Pick<Post, "id" | "content">): Promise<Post> {
  const res = await apiContractClient.updatePost({
    params: { id },
    body: { content },
  });
  revalidateTag(`post-${res.post.id}`, "max");
  return res.post;
}
