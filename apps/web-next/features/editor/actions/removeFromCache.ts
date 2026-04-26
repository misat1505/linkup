"use server";

import { apiContractClient } from "@/lib/apiQueryClient";

export async function removeFromCache(url: string): Promise<void> {
  const splitted = url.split("/");
  const lastPart = splitted[splitted.length - 1];
  const filename = lastPart.split("?")[0];

  await apiContractClient.deleteFromCache({
    params: { filename },
  });
}
