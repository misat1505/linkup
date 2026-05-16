"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { Post } from "@packages/schemas";
import { revalidatePath } from "next/cache";

export async function deletePost(id: Post["id"]): Promise<void> {
	await apiContractClient.deletePost({
		params: { id },
	});

	revalidatePath("/posts");
}
