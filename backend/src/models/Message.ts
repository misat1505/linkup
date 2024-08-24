import { File } from "./File";
import { Reaction } from "./Reaction";
import { User } from "./User";

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
