import { User } from "../models/User";
import { USER_API } from "./utils";

export class UserService {
  static async search(term: string): Promise<User[]> {
    const {
      data: { users: data }
    } = await USER_API.get(`/search?term=${term}`);

    const users = data.map(({ lastActive, ...rest }: any) => ({
      lastActive: new Date(lastActive),
      ...rest
    })) as User[];

    return users;
  }
}
