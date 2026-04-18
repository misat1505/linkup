"use server";

import { CHAT_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Chat } from "@packages/schemas";
import { cache } from "react";
import z from "zod";

export const getChatsCached = cache(async () => {
  const api = await serverSideRequestFactory({
    base: CHAT_API,
    include: {
      accessToken: true,
    },
  });

  const response = await api.get("/");
  return z.array(Chat).parse(response.data.chats);
});
