import { authContract } from "./auth";
import { chatsContract } from "./chat";
import { filesContract } from "./files";
import { friendshipsContract } from "./friendships";

export const API_CONTRACT = {
  ...authContract,
  ...chatsContract,
  ...filesContract,
  ...friendshipsContract,
};
