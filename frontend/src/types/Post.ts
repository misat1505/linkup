import { Chat } from "./Chat";
import { File } from "./File";
import { User } from "./User";

export type Post = {
  id: string;
  content: string;
  chatId: Chat["id"];
  author: User;
  files: File[];
};
