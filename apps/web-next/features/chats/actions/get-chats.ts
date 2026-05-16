"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { cache } from "react";

export const getChatsCached = cache(async () => {
	const res = await apiContractClient.getSelfChats();
	return res.chats;
});
