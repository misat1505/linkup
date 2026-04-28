"use server";

import { apiContractClient } from "@/lib/apiQueryClient";
import { Post } from "@packages/schemas";

export async function getPost(id: Post["id"]): Promise<Post | null> {
  const res = await apiContractClient.getPost({ params: { id } });
  return res.post;
}
