"use server";

import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat } from "../schemas/chat";
import { CHAT_API } from "@/utils/api";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function leaveChat(chatId: Chat["id"]): Promise<void> {
  const api = await serverSideRequestFactory({
    base: CHAT_API,
    include: { accessToken: true },
  });

  await api.delete(`${chatId}/users`);

  revalidatePath("/chats");
  redirect("/chats");
}
