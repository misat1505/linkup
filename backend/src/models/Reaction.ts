import { Message } from "./Message";
import { isUser, User } from "./User";

export type Reaction = {
  id: string;
  name: string;
  messageId: Message["id"];
  user: User;
};

export function isReaction(obj: any): obj is Reaction {
  return (
    typeof obj.id === "string" &&
    typeof obj.name === "string" &&
    typeof obj.messageId === "string" &&
    isUser(obj.user)
  );
}
