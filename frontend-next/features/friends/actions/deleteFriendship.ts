"use server";

import { User } from "@/features/auth/schemas/user";
import { FRIENDS_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { revalidatePath } from "next/cache";

export async function deleteFriendship(
  requesterId: User["id"],
  acceptorId: User["id"],
): Promise<void> {
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

  await api.request({
    url: "/",
    method: "DELETE",
    data: body,
  });

  revalidatePath("/friends");
}
