import { Message } from "../types/Message";
import { User } from "../types/User";

export class MessageUtils {
  private message: Message;
  private me: User;

  constructor(message: Message, me: User) {
    this.message = message;
    this.me = me;
  }

  public getResponseText(): string {
    const { author: messageAuthor } = this.message;
    const { author: responseAuthor } = this.message.response!;

    if (messageAuthor.id === this.me.id) {
      if (responseAuthor.id === this.me.id) return `You replied to yourself.`;
      return `You replied to ${responseAuthor.firstName} ${responseAuthor.lastName}.`;
    }

    if (responseAuthor.id === this.me.id)
      return `${messageAuthor.firstName} ${messageAuthor.lastName} replied to you.`;

    if (responseAuthor.id === messageAuthor.id)
      return `${messageAuthor.firstName} ${messageAuthor.lastName} replied to themselves.`;
    return `${messageAuthor.firstName} ${messageAuthor.lastName} replied to ${responseAuthor.firstName} ${responseAuthor.lastName}.`;
  }
}
