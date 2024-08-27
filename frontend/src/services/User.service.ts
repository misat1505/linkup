import { User } from "../types/User";
import { USER_API } from "./utils";

export class UserService {
  static async search(term: string): Promise<User[]> {
    const {
      data: { users }
    } = await USER_API.get(`/search?term=${term}`);

    return users;
  }
}
