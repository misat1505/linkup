"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { Chat, Message } from "@packages/schemas";

export async function createMessage(chatId: Chat["id"], formData: FormData): Promise<Message> {
	const content = formData.get("content") as string;
	const responseId = formData.get("responseId") as string | null;
	const files = formData.getAll("files") as File[];

	const res = await apiContractClient.createMessage({
		params: { chatId },
		body: {
			content,
			responseId: responseId ?? null,
			files: files.length > 0 ? files : undefined,
		},
	});

	return res.message;
}
