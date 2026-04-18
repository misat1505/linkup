"use server";

import { CHAT_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat, Message } from "@packages/schemas";
import z from "zod";

export async function getMessages(
  chatId: Chat["id"],
  responseId?: Message["id"] | null,
  lastMessageId?: Message["id"] | null,
): Promise<Message[]> {
  const params = new URLSearchParams();
  if (responseId !== undefined) params.set("responseId", responseId || "null");
  if (lastMessageId !== undefined) {
    params.set("lastMessageId", lastMessageId || "null");

    // TODO: maybe do sth about it
    // params.set("limit", localStorage.getItem("messages-limit") || "20");
    params.set("limit", "20");
  }

  const api = await serverSideRequestFactory({
    base: CHAT_API,
    include: {
      accessToken: true,
    },
  });

  const response = await api.get(`/${chatId}/messages`, { params });
  return z.array(Message).parse(response.data.messages);
}
