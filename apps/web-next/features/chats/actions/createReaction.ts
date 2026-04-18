"use server";

import { CHAT_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat, Message, Reaction } from "@packages/schemas";

export async function createReaction(
  messageId: Message["id"],
  reactionId: Reaction["id"],
  chatId: Chat["id"],
): Promise<Reaction> {
  const api = await serverSideRequestFactory({
    base: CHAT_API,
    include: { accessToken: true },
  });

  const response = await api.post(`/${chatId}/reactions`, {
    messageId,
    reactionId,
  });
  return Reaction.parse(response.data.reaction);
}
