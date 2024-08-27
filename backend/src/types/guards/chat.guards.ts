import { Chat } from "../Chat";
import { isPartialMessage } from "./message.guard";
import { isUser } from "./user.guard";
import { defaultOptions, hasOnlyKeys } from "./utils";

export function isChat(obj: any, options = defaultOptions): obj is Chat {
  const allowedKeys = [
    "id",
    "createdAt",
    "name",
    "photoURL",
    "type",
    "users",
    "lastMessage",
  ];

  return (
    obj &&
    typeof obj === "object" &&
    hasOnlyKeys(obj, allowedKeys) &&
    typeof obj.id === "string" &&
    (obj.createdAt instanceof Date ||
      (options.allowStringifiedDates &&
        typeof obj.createdAt === "string" &&
        !isNaN(Date.parse(obj.createdAt)))) &&
    (typeof obj.name === "string" || obj.name === null) &&
    (typeof obj.photoURL === "string" || obj.photoURL === null) &&
    ["PRIVATE", "GROUP", "POST"].includes(obj.type) &&
    (obj.users === null ||
      (Array.isArray(obj.users) &&
        obj.users.every((user: unknown) => isUser(user, options)))) &&
    (obj.lastMessage === null || isPartialMessage(obj.lastMessage, options))
  );
}
