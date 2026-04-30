"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { Friendship, User } from "@packages/schemas";
import { revalidatePath } from "next/cache";

export async function acceptFriendship(
  requesterId: User["id"],
  acceptorId: User["id"],
): Promise<Friendship> {
  const body = {
    requesterId,
    acceptorId,
  };

  const res = await apiContractClient.acceptFriendship({
    body,
  });

  revalidatePath("/friends");
  return res.friendship;
}
