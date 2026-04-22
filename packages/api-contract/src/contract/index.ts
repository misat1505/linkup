import { authContract } from "./auth";
import { chatsContract } from "./chat";
import { filesContract } from "./files";

export const API_CONTRACT = {
  ...authContract,
  ...chatsContract,
  ...filesContract,
};
