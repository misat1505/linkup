import { Chat } from "@/types/Chat";
import { Message } from "@/types/Message";
import { User } from "@/types/User";
import { ChatUtils } from "./chatUtils";
import { createFullName } from "./createFullName";

export class ChatFooterUtils {
  private chat: Chat;
  private message: Message;
  private me: User;

  constructor(chat: Chat, message: Message, me: User) {
    this.chat = chat;
    this.message = message;
    this.me = me;
  }

  public getReplyAuthorText(): string {
    const common = "Replying to ";

    const chatUtils = new ChatUtils(this.chat, this.me);
    const author = chatUtils.getUserById(this.message.author.id);
    if (!author) return common + createFullName(this.message.author);
    if (author.id === this.me.id) return common + "you";

    if (author.alias) return `${common}${author.alias}`;
    return `${common}${createFullName(author as User)}`;
  }

  public getReplyText() {
    if (this.message.content) return this.message.content;
    return `Sent ${this.message.files.length} file(s).`;
  }
}
