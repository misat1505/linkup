"use server";

import { apiContractClient } from "@/lib/apiQueryClient";
import { API_URL } from "@/utils/constants";

export async function getCache(): Promise<string[]> {
  const res = await apiContractClient.getCache();
  return res.files.map((file) => `${API_URL}/files/${file}?filter=cache`);
}
