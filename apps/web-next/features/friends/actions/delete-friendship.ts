"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { User } from "@packages/schemas";
import { revalidatePath } from "next/cache";

export async function deleteFriendship(
	requesterId: User["id"],
	acceptorId: User["id"],
): Promise<void> {
	const body = {
		requesterId,
		acceptorId,
	};

	await apiContractClient.deleteFriendship({
		body,
	});

	revalidatePath("/friends");
}
