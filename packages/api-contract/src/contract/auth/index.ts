import { getSelfRoute } from "./get-self";

export const authContract = {
  GET_SELF: getSelfRoute,
} as const;
