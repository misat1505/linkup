import { Message } from "./Message";
import { User } from "./User";

export type Chat = {
  id: string;
  createdAt: Date;
  name: string | null;
  photoURL: string | null;
  type: "PRIVATE" | "GROUP" | "POST";
  users: User[] | null;
  lastMessage: Omit<Message, "response" | "reactions"> | null;
};
