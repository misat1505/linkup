import { File, isFile } from "./File";
import { isReaction, Reaction } from "./Reaction";
import { isUser, User } from "./User";
import { defaultOptions, hasOnlyKeys } from "./utils";

export type Message = {
  id: string;
  content: string | null;
  author: User;
  createdAt: Date;
  response: Omit<Message, "response" | "reactions"> | null;
  chatId: string;
  files: File[];
  reactions: Reaction[];
};

const partialMessageAllowedKeys = [
  "id",
  "content",
  "author",
  "createdAt",
  "chatId",
  "files",
];
const fullMessageAllowedKeys = [
  ...partialMessageAllowedKeys,
  "response",
  "reactions",
];

export function isMessage(obj: any, options = defaultOptions): obj is Message {
  return (
    obj &&
    typeof obj === "object" &&
    hasOnlyKeys(obj, fullMessageAllowedKeys) &&
    typeof obj.id === "string" &&
    (typeof obj.content === "string" || obj.content === null) &&
    isUser(obj.author, options) &&
    (obj.createdAt instanceof Date ||
      (options.allowStringifiedDates &&
        typeof obj.createdAt === "string" &&
        !isNaN(Date.parse(obj.createdAt)))) &&
    typeof obj.chatId === "string" &&
    Array.isArray(obj.files) &&
    obj.files.every(isFile) &&
    (obj.response === null || isPartialMessage(obj.response, options)) &&
    Array.isArray(obj.reactions) &&
    obj.reactions.every((reaction: unknown) => isReaction(reaction, options))
  );
}

export function isPartialMessage(
  obj: any,
  options = defaultOptions
): obj is Omit<Message, "response" | "reactions"> {
  return (
    obj &&
    typeof obj === "object" &&
    hasOnlyKeys(obj, partialMessageAllowedKeys) &&
    typeof obj.id === "string" &&
    (typeof obj.content === "string" || obj.content === null) &&
    isUser(obj.author, options) &&
    (obj.createdAt instanceof Date ||
      (options.allowStringifiedDates &&
        typeof obj.createdAt === "string" &&
        !isNaN(Date.parse(obj.createdAt)))) &&
    typeof obj.chatId === "string" &&
    Array.isArray(obj.files) &&
    obj.files.every(isFile)
  );
}
