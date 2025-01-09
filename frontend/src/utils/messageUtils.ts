import { Chat } from "@/types/Chat";
import { Message } from "@/types/Message";
import { User } from "@/types/User";
import { createFullName } from "./createFullName";

export class MessageUtils {
  private chat: Chat;
  private message: Message;
  private me: User;

  constructor(chat: Chat, message: Message, me: User) {
    this.message = message;
    this.me = me;
    this.chat = chat;
  }

  private getDisplayNameById(id: User["id"]): string {
    const user = this.chat.users?.find((u) => u.id === id);
    if (!user) return createFullName(this.message.author);

    if (user.alias) return user.alias;
    return createFullName(user as User);
  }

  public getResponseText(): string {
    const { author: messageAuthor } = this.message;
    const { author: responseAuthor } = this.message.response!;

    const messageDisplayName = this.getDisplayNameById(messageAuthor.id);
    const responseDisplayName = this.getDisplayNameById(responseAuthor.id);

    if (messageAuthor.id === this.me.id) {
      if (responseAuthor.id === this.me.id) return `You replied to yourself.`;
      return `You replied to ${responseDisplayName}.`;
    }

    if (responseAuthor.id === this.me.id)
      return `${messageDisplayName} replied to you.`;

    if (responseAuthor.id === messageAuthor.id)
      return `${messageDisplayName} replied to themselves.`;
    return `${messageDisplayName} replied to ${responseDisplayName}.`;
  }
}
