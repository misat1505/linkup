"use server";

import { Chat } from "@packages/schemas";
import { cache } from "react";
import { getChatsCached } from "./get-chats";

export const getChatByIdCached = cache(async (id: Chat["id"]) => {
	const chats = await getChatsCached();

	return chats.find((c) => c.id === id) ?? null;
});
