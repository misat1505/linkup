"use server";

import { apiContractClient } from "@/lib/api-query-client";
import { Reaction } from "@packages/schemas";
import z from "zod";

const ReactionBase = Reaction.pick({ id: true, name: true });

type ReactionBase = z.infer<typeof ReactionBase>;

export async function getReactions(): Promise<ReactionBase[]> {
  const res = await apiContractClient.getReactions();
  return res.reactions;
}
