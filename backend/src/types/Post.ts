import { Chat } from "./Chat";
import { User } from "./User";

export type Post = {
  id: string;
  content: string;
  createdAt: Date;
  chat: Chat;
  author: User;
};
