"use server";

import { apiContractClient } from "@/lib/apiQueryClient";
import { Friendship, User } from "@packages/schemas";
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

    const res = await apiContractClient.createFriendship({
      body,
    });

    revalidatePath("/friends");
    return res.friendship;
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === HttpStatusCode.Conflict) {
        return null;
      }
    }
    throw e;
  }
}
