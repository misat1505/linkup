"use server";
import { apiContractClient } from "@/lib/api-query-client";
import { Chat, User, UserInChat } from "@packages/schemas";
import { revalidatePath } from "next/cache";

export async function updateAlias(
  chatId: Chat["id"],
  userId: User["id"],
  alias: UserInChat["alias"],
): Promise<void> {
  await apiContractClient.updateUserAlias({
    body: { alias },
    params: { chatId, userId },
  });

  revalidatePath(`/chats/${chatId}`);
}
