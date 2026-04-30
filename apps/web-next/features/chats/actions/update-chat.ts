"use server";

import { CHAT_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/server-side-request-factory";
import { Chat } from "@packages/schemas";
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
