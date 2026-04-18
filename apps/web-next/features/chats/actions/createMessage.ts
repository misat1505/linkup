"use server";

import { CHAT_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat, Message } from "@packages/schemas";

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
