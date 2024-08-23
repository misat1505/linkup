import { Message } from "../models/Message";
import { User } from "../models/User";

export class ChatFooterUtils {
  private message: Message;
  private me: User;

  constructor(message: Message, me: User) {
    this.message = message;
    this.me = me;
  }

  public getReplyAuthorText(): string {
    const common = "Replying to ";
    if (this.message.author.id === this.me.id) return common + "you";
    return `${common}${this.message.author.firstName} ${this.message.author.lastName}`;
  }

  public getReplyText() {
    if (this.message.content) return this.message.content;
    return `Sent ${this.message.files.length} file(s).`;
  }
}
