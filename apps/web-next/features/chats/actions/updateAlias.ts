"use server";
import { CHAT_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat, User, UserInChat } from "@packages/schemas";
import { revalidatePath } from "next/cache";

export async function updateAlias(
  chatId: Chat["id"],
  userId: User["id"],
  alias: UserInChat["alias"],
): Promise<void> {
  const api = await serverSideRequestFactory({
    base: CHAT_API,
    include: { accessToken: true },
  });

  await api.put(`/${chatId}/users/${userId}/alias`, { alias });

  revalidatePath(`/chats/${chatId}`);
}
