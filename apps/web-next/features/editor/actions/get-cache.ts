"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { buildFileURL } from "@packages/ui/utils/build-file-url";

export async function getCache(): Promise<string[]> {
  const res = await apiContractClient.getCache();
  return res.files.map((file) => buildFileURL(file, { type: "cache" }));
}
