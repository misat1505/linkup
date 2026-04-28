"use server";

import { apiContractClient } from "@/lib/apiQueryClient";
import { buildFileURL } from "@/utils/buildFileURL";

export async function getCache(): Promise<string[]> {
  const res = await apiContractClient.getCache();
  return res.files.map((file) => buildFileURL(file, { type: "cache" }));
}
