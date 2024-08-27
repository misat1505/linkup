import { File, isFile } from "./File";
import { isReaction, Reaction } from "./Reaction";
import { isUser, User } from "./User";

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

export function isMessage(obj: any): obj is Message {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    (typeof obj.content === "string" || obj.content === null) &&
    isUser(obj.author) &&
    obj.createdAt instanceof Date &&
    (obj.response === null || isPartialMessage(obj.response)) &&
    typeof obj.chatId === "string" &&
    Array.isArray(obj.files) &&
    obj.files.every(isFile) &&
    Array.isArray(obj.reactions) &&
    obj.reactions.every(isReaction)
  );
}

export function isPartialMessage(
  obj: any
): obj is Omit<Message, "response" | "reactions"> {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    (typeof obj.content === "string" || obj.content === null) &&
    isUser(obj.author) &&
    obj.createdAt instanceof Date &&
    typeof obj.chatId === "string" &&
    Array.isArray(obj.files) &&
    obj.files.every(isFile)
  );
}
