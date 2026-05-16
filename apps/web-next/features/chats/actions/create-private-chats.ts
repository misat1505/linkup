"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { Chat, User } from "@packages/schemas";
import { AxiosError, HttpStatusCode } from "axios";

export async function createPrivateChat(user1: User["id"], user2: User["id"]): Promise<Chat> {
	try {
		const body = {
			users: [user1, user2],
		};

		const res = await apiContractClient.createPrivateChat({ body });
		return res.chat;
	} catch (e) {
		if (e instanceof AxiosError) {
			if (e.response?.status === HttpStatusCode.Conflict) {
				return e.response.data.chat;
			}
		}
		throw e;
	}
}
