import { AxiosError } from "axios";
import { Friendship } from "../types/Friendship";
import { User } from "../types/User";
import { FRIENDS_API } from "./utils";

export class FriendService {
  static async getMyFriendships(): Promise<Friendship[]> {
    await new Promise((res) =>
      setTimeout(() => {
        res(null);
      }, 1000)
    );
    const response = await FRIENDS_API.get("/");
    return response.data.friendships;
  }

  static async createFriendship(
    requesterId: User["id"],
    acceptorId: User["id"]
  ): Promise<Friendship | null> {
    try {
      const body = {
        requesterId,
        acceptorId
      };

      const response = await FRIENDS_API.post("/", body);

      return response.data.friendship;
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === 409) {
          return null;
        }
      }
      throw e;
    }
  }
}
