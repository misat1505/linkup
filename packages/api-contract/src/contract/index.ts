import { authContract } from "./auth";
import { chatsContract } from "./chat";
import { filesContract } from "./files";
import { friendshipsContract } from "./friendships";
import { postsContract } from "./posts";
import { usersContract } from "./users";

export const API_CONTRACT = {
  ...authContract,
  ...chatsContract,
  ...filesContract,
  ...friendshipsContract,
  ...postsContract,
  ...usersContract,
};
