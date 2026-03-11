"use server";

import { User } from "@/features/auth/schemas/user";
import { Chat, UserInChat } from "../schemas/chat";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { CHAT_API } from "@/utils/api";
import { revalidatePath } from "next/cache";

export async function addUserToChat(
  chatId: Chat["id"],
  userId: User["id"],
): Promise<UserInChat> {
  const api = await serverSideRequestFactory({
    base: CHAT_API,
    include: { accessToken: true },
  });

  const response = await api.post(`${chatId}/users`, { userId });

  revalidatePath(`/chats/${chatId}`);
  return UserInChat.parse(response.data.user);
}
