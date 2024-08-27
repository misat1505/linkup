import { Message } from "./Message";
import { isUser, User } from "./User";
import { defaultOptions, hasOnlyKeys } from "./utils";

export type Reaction = {
  id: string;
  name: string;
  messageId: Message["id"];
  user: User;
};

export function isReaction(
  obj: any,
  options = defaultOptions
): obj is Reaction {
  const allowedKeys = ["id", "name", "messageId", "user"];

  return (
    obj &&
    typeof obj === "object" &&
    hasOnlyKeys(obj, allowedKeys) &&
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.messageId === "string" &&
    isUser(obj.user, options)
  );
}
