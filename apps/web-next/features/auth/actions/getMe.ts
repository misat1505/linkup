"use server";

import { apiContractClient } from "@/lib/apiQueryClient";
import { cache } from "react";

export const getMeCached = cache(async () => {
  const res = await apiContractClient.getSelf();
  return res.user;
});
