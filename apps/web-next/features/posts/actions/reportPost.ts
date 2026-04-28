"use server";

import { apiContractClient } from "@/lib/apiQueryClient";
import { Post } from "@packages/schemas";

export async function reportPost(postId: Post["id"]): Promise<void> {
  await apiContractClient.reportPost({ params: { id: postId } });
}
