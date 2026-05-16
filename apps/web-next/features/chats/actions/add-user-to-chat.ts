"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { Chat, User, UserInChat } from "@packages/schemas";

export async function addUserToChat(chatId: Chat["id"], userId: User["id"]): Promise<UserInChat> {
	const res = await apiContractClient.addUserToGroupChat({
		body: { userId },
		params: { chatId },
	});
	return res.user;
}
