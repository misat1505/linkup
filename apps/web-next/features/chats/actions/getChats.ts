"use server";

import { apiContractClient } from "@/lib/apiQueryClient";
import { cache } from "react";

export const getChatsCached = cache(async () => {
  const res = await apiContractClient.getSelfChats();
  return res.chats;
});
