import { apiContractClient } from "@/lib/apiContractClient";
import { Friendship, User } from "@packages/schemas";
import { AxiosError, HttpStatusCode } from "axios";

export class FriendService {
  static async getMyFriendships(): Promise<Friendship[]> {
    const res = await apiContractClient.getUserFriendships();
    return res.friendships.filter(
      (fr: Friendship) => fr.requester.id !== fr.acceptor.id,
    );
  }

  static async createFriendship(
    requesterId: User["id"],
    acceptorId: User["id"],
  ): Promise<Friendship | null> {
    try {
      const res = await apiContractClient.createFriendship({
        body: { acceptorId, requesterId },
      });
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

  static async acceptFriendship(
    requesterId: User["id"],
    acceptorId: User["id"],
  ): Promise<Friendship> {
    const res = await apiContractClient.acceptFriendship({
      body: { acceptorId, requesterId },
    });
    return res.friendship;
  }

  static async deleteFriendship(
    requesterId: User["id"],
    acceptorId: User["id"],
  ): Promise<void> {
    await apiContractClient.deleteFriendship({
      body: { acceptorId, requesterId },
    });
  }
}
