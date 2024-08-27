import { Message } from "./Message";
import { User } from "./User";

export type Reaction = {
  id: string;
  name: string;
  messageId: Message["id"];
  user: User;
};
