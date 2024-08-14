import { User } from "./User";

export type Message = {
  id: string;
  content: string | null;
  author: User;
  createdAt: Date;
  response: Omit<Message, "response"> | null;
  chatId: string;
};
