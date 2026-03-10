"use server";

import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat } from "../schemas/chat";
import { CHAT_API } from "@/utils/api";
import z from "zod";

export async function getChats(): Promise<Chat[]> {
  const api = await serverSideRequestFactory({
    base: CHAT_API,
    include: {
      accessToken: true,
    },
  });

  const response = await api.get("");
  return z.array(Chat).parse(response.data.chats);
}
