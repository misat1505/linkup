import { authContract } from "./auth";
import { chatsContract } from "./chat";

export const API_CONTRACT = {
  ...authContract,
  ...chatsContract,
};
