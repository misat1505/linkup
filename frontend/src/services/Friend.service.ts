import { Friendship } from "@/types/Friendship";
import { AxiosError, HttpStatusCode } from "axios";
import { FRIENDS_API } from "./utils";
import { User } from "@/types/User";

export class FriendService {
  static async getMyFriendships(): Promise<Friendship[]> {
    const response = await FRIENDS_API.get("/");
    return response.data.friendships.filter(
      (fr: Friendship) => fr.requester.id !== fr.acceptor.id
    );
  }

  static async createFriendship(
    requesterId: User["id"],
    acceptorId: User["id"]
  ): Promise<Friendship | null> {
    try {
      const body = {
        requesterId,
        acceptorId,
      };

      const response = await FRIENDS_API.post("/", body);

      return response.data.friendship;
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
    acceptorId: User["id"]
  ): Promise<Friendship> {
    const body = {
      requesterId,
      acceptorId,
    };
    const response = await FRIENDS_API.post("/accept", body);
    return response.data.friendship;
  }

  static async deleteFriendship(
    requesterId: User["id"],
    acceptorId: User["id"]
  ): Promise<void> {
    const body = {
      requesterId,
      acceptorId,
    };
    await FRIENDS_API.request({
      url: "/",
      method: "DELETE",
      data: body,
    });
    return;
  }
}
