import { API_CONTRACT } from "../contract";

export const TAGS = {
  AUTH: "Auth",
};

export const CONTRACT_KEYS = {
  GET_SELF: "GET_SELF",
} as const satisfies Record<string, keyof typeof API_CONTRACT>;
