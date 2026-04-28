"use server";
import { apiContractClient } from "@/lib/apiQueryClient";
import { User } from "@packages/schemas";

export async function searchUsers(term: string): Promise<User[]> {
  const res = await apiContractClient.searchUser({ query: { term } });
  return res.users;
}
