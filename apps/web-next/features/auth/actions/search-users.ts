"use server";
import { apiContractClient } from "@/lib/api-query-client";
import { User } from "@packages/schemas";

export async function searchUsers(term: string): Promise<User[]> {
  const res = await apiContractClient.searchUser({ query: { term } });
  return res.users;
}
