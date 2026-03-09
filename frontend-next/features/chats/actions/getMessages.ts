"use server";

import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat } from "../schemas/chat";
import { Message } from "../schemas/message";
import { CHAT_API } from "@/utils/api";
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
    params.set("limit", localStorage.getItem("messages-limit") || "20");
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
