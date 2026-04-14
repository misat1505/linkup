"use server";

import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat } from "../schemas/chat";
import { Message } from "../schemas/message";
import { Reaction } from "../schemas/reaction";
import { CHAT_API } from "@/utils/api";

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
