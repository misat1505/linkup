import { isPartialMessage, Message } from "./Message";
import { isUser, User } from "./User";

export type Chat = {
  id: string;
  createdAt: Date;
  name: string | null;
  photoURL: string | null;
  type: "PRIVATE" | "GROUP" | "POST";
  users: User[] | null;
  lastMessage: Omit<Message, "response" | "reactions"> | null;
};

export function isChat(obj: any): obj is Chat {
  return (
    obj &&
    typeof obj === "object" &&
    typeof obj.id === "string" &&
    obj.createdAt instanceof Date &&
    (typeof obj.name === "string" || obj.name === null) &&
    (typeof obj.photoURL === "string" || obj.photoURL === null) &&
    ["PRIVATE", "GROUP", "POST"].includes(obj.type) &&
    (obj.users === null ||
      (Array.isArray(obj.users) && obj.users.every(isUser))) &&
    (obj.lastMessage === null || isPartialMessage(obj.lastMessage))
  );
}
