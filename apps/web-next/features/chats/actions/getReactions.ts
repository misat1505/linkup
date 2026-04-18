"use server";

import { CHAT_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Reaction } from "@packages/schemas";
import z from "zod";

const ReactionBase = Reaction.pick({ id: true, name: true });

type ReactionBase = z.infer<typeof ReactionBase>;

export async function getReactions(): Promise<ReactionBase[]> {
  const api = await serverSideRequestFactory({
    base: CHAT_API,
  });

  const response = await api.get("/reactions");
  return z.array(ReactionBase).parse(response.data.reactions);
}
