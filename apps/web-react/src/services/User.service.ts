import { apiContractClient } from "@/lib/apiContractClient";
import { User } from "@packages/schemas";

export class UserService {
  static async search(term: string): Promise<User[]> {
    const res = await apiContractClient.searchUser({ query: { term } });
    return res.users;
  }
}
