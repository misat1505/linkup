"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { Chat } from "@packages/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function leaveChat(chatId: Chat["id"]): Promise<void> {
  await apiContractClient.deleteSelfFromGroupChat({ params: { chatId } });

  revalidatePath("/chats");
  redirect("/chats");
}
