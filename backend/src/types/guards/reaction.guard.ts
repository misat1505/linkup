import { Reaction } from "@prisma/client";
import { defaultOptions, hasOnlyKeys } from "./utils";
import { isUser } from "./user.guard";

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

export function isAvailableReaction(
  obj: any,
  options = defaultOptions
): obj is Reaction {
  const allowedKeys = ["id", "name"];

  return (
    obj &&
    typeof obj === "object" &&
    hasOnlyKeys(obj, allowedKeys) &&
    typeof obj.id === "string" &&
    typeof obj.name === "string"
  );
}
