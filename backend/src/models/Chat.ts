import { isPartialMessage, Message } from "./Message";
import { isUser, User } from "./User";
import { defaultOptions, hasOnlyKeys } from "./utils";

export type Chat = {
  id: string;
  createdAt: Date;
  name: string | null;
  photoURL: string | null;
  type: "PRIVATE" | "GROUP" | "POST";
  users: User[] | null;
  lastMessage: Omit<Message, "response" | "reactions"> | null;
};

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
