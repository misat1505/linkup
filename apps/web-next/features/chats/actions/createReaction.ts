"use server";

import { apiContractClient } from "@/lib/apiQueryClient";
import { Chat, Message, Reaction } from "@packages/schemas";

export async function createReaction(
  messageId: Message["id"],
  reactionId: Reaction["id"],
  chatId: Chat["id"],
): Promise<Reaction> {
  const res = await apiContractClient.createReaction({
    body: { messageId, reactionId },
    params: { chatId },
  });
  return res.reaction;
}
