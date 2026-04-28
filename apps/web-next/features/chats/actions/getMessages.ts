"use server";

import { apiContractClient } from "@/lib/apiQueryClient";
import { Chat, Message } from "@packages/schemas";

export async function getMessages(
  chatId: Chat["id"],
  responseId?: Message["id"] | null,
  lastMessageId?: Message["id"] | null,
): Promise<Message[]> {
  const res = await apiContractClient.getChatMessages({
    // TODO: hardcoded 20
    query: { lastMessageId, responseId, limit: 20 },
    params: { chatId },
  });
  return res.messages;
}
