"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { Friendship } from "@packages/schemas";

export async function getMyFriendships(): Promise<Friendship[]> {
  const res = await apiContractClient.getUserFriendships();

  return res.friendships.filter((fr) => fr.requester.id !== fr.acceptor.id);
}
