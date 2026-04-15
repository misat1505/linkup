"use server";

import { User } from "@/features/auth/schemas/user";
import { Friendship } from "../schemas/friendship";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { FRIENDS_API } from "@/utils/api";
import { AxiosError, HttpStatusCode } from "axios";
import { revalidatePath } from "next/cache";

export async function createFriendship(
  requesterId: User["id"],
  acceptorId: User["id"],
): Promise<Friendship | null> {
  try {
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

    const response = await api.post("/", body);

    revalidatePath("/friends");
    return Friendship.parse(response.data.friendship);
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === HttpStatusCode.Conflict) {
        return null;
      }
    }
    throw e;
  }
}
