import { API_CONTRACT } from "../contract";

export const TAGS = {
  AUTH: "Auth",
  CHATS: "Chats",
  FILES: "Files",
  FRIENDSHIPS: "Friendships",
};

export const CONTRACT_KEYS = {
  GET_SELF: "GET_SELF",
} as const satisfies Record<string, keyof typeof API_CONTRACT>;
