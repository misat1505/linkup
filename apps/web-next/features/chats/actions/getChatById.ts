"use server";

import { cache } from "react";
import { Chat } from "../schemas/chat";
import { getChatsCached } from "./getChats";

export const getChatByIdCached = cache(async (id: Chat["id"]) => {
  const chats = await getChatsCached();

  return chats.find((c) => c.id === id) ?? null;
});
