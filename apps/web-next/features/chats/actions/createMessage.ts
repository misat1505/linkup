"use server";

import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat } from "../schemas/chat";
import { Message } from "../schemas/message";
import { CHAT_API } from "@/utils/api";

export async function createMessage(
  chatId: Chat["id"],
  formData: FormData,
): Promise<Message> {
  const api = await serverSideRequestFactory({
    base: CHAT_API,
    include: {
      accessToken: true,
    },
  });

  const response = await api.post(`/${chatId}/messages`, formData);
  return Message.parse(response.data.message);
}
