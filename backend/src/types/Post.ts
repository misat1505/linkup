import { Chat } from "./Chat";
import { User } from "./User";

export type Post = {
  id: string;
  content: string;
  createdAt: Date;
  chatId: Chat["id"];
  author: User;
};
