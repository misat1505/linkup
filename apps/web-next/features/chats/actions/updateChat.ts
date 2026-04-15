"use server";

import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat } from "../schemas/chat";
import { CHAT_API } from "@/utils/api";
import { revalidatePath } from "next/cache";

export async function updateChat(
  chatId: Chat["id"],
  formData: FormData,
): Promise<Chat> {
  const api = await serverSideRequestFactory({
    base: CHAT_API,
    include: { accessToken: true },
  });

  const response = await api.put(`${chatId}`, formData);

  revalidatePath(`/chats/${chatId}`);
  return Chat.parse(response.data.chat);
}
