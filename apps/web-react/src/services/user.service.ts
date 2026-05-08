import { apiContractClient } from "@/lib/api-contract-client";
import { User } from "@packages/schemas";

export class UserService {
  static async search(term: string): Promise<User[]> {
    const res = await apiContractClient.searchUser({ query: { term } });
    return res.users;
  }
}
