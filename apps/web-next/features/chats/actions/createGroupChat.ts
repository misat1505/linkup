"use server";

import { CHAT_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat } from "@packages/schemas";

export async function createGroupChat(formData: FormData): Promise<Chat> {
  const api = await serverSideRequestFactory({
    base: CHAT_API,
    include: { accessToken: true },
  });

  const response = await api.post(`/group`, formData);
  return Chat.parse(response.data.chat);
}
