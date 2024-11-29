import { Friendship } from "../Friendship";
import { isUser } from "./user.guard";
import { defaultOptions, hasOnlyKeys } from "./utils";

export function isFriendship(
  obj: any,
  options = defaultOptions
): obj is Friendship {
  const allowedKeys = ["requester", "acceptor", "status"];

  return (
    obj &&
    typeof obj === "object" &&
    hasOnlyKeys(obj, allowedKeys) &&
    isUser(obj.requester, options) &&
    isUser(obj.acceptor, options) &&
    (obj.status === "PENDING" || obj.status === "ACCEPTED")
  );
}
