"use server";

import { FRIENDS_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { Friendship, User } from "@packages/schemas";
import { revalidatePath } from "next/cache";

export async function acceptFriendship(
  requesterId: User["id"],
  acceptorId: User["id"],
): Promise<Friendship> {
  const body = {
    requesterId,
    acceptorId,
  };

  const api = await serverSideRequestFactory({
    base: FRIENDS_API,
    include: {
      accessToken: true,
    },
  });

  const response = await api.post("/accept", body);
  revalidatePath("/friends");
  return Friendship.parse(response.data.friendship);
}
