"use server";

import { CHAT_API } from "@/utils/api";
import z from "zod";
import { Reaction } from "../schemas/reaction";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";

const ReactionBase = Reaction.pick({ id: true, name: true });

type ReactionBase = z.infer<typeof ReactionBase>;

export async function getReactions(): Promise<ReactionBase[]> {
  const api = await serverSideRequestFactory({
    base: CHAT_API,
  });

  const response = await api.get("/reactions");
  return z.array(ReactionBase).parse(response.data.reactions);
}
