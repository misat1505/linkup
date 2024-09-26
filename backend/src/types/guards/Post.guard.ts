import { Post } from "../Post";
import { isChat } from "./chat.guard";
import { isUser } from "./user.guard";
import { defaultOptions, hasOnlyKeys } from "./utils";

export function isPost(obj: any, options = defaultOptions): obj is Post {
  const allowedKeys = ["id", "content", "createdAt", "chat", "author"];

  return (
    obj &&
    typeof obj === "object" &&
    hasOnlyKeys(obj, allowedKeys) &&
    typeof obj.id === "string" &&
    typeof obj.content === "string" &&
    (obj.createdAt instanceof Date ||
      (options.allowStringifiedDates &&
        typeof obj.createdAt === "string" &&
        !isNaN(Date.parse(obj.createdAt)))) &&
    isChat(obj.chat, options) &&
    isUser(obj.author, options)
  );
}
