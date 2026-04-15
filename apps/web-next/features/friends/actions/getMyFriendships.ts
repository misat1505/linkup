"use server";

import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Friendship } from "../schemas/friendship";
import { FRIENDS_API } from "@/utils/api";
import z from "zod";

export async function getMyFriendships(): Promise<Friendship[]> {
  const api = await serverSideRequestFactory({
    base: FRIENDS_API,
    include: {
      accessToken: true,
    },
  });

  const response = await api.get("/");
  const friendships = z.array(Friendship).parse(response.data.friendships);

  const filteredFriendships = friendships.filter(
    (fr) => fr.requester.id !== fr.acceptor.id,
  );

  return filteredFriendships;
}
