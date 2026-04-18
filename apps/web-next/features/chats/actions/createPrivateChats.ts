"use server";

import { CHAT_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat, User } from "@packages/schemas";
import { AxiosError, HttpStatusCode } from "axios";

export async function createPrivateChat(
  user1: User["id"],
  user2: User["id"],
): Promise<Chat> {
  try {
    const body = {
      users: [user1, user2],
    };

    const api = await serverSideRequestFactory({
      base: CHAT_API,
      include: {
        accessToken: true,
      },
    });

    const response = await api.post("/private", body);

    return Chat.parse(response.data.chat);
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === HttpStatusCode.Conflict) {
        return e.response.data.chat;
      }
    }
    throw e;
  }
}
