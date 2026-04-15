import { Chat } from "@/types/Chat";
import { Message } from "@/types/Message";
import { User } from "@/types/User";
import { ChatUtils } from "./chatUtils";
import { createFullName } from "./createFullName";
import { TFunction } from "i18next";

export class ChatFooterUtils {
  private chat: Chat;
  private message: Message;
  private me: User;
  private t: TFunction<"translation", undefined>;

  constructor(
    chat: Chat,
    message: Message,
    me: User,
    translations: TFunction<"translation", undefined>
  ) {
    this.chat = chat;
    this.message = message;
    this.me = me;
    this.t = translations;
  }

  public getReplyAuthorText(): string {
    const chatUtils = new ChatUtils(this.chat, this.me);
    const author = chatUtils.getUserById(this.message.author.id);
    if (!author)
      return this.t("chats.form.reply.author.other", {
        name: createFullName(this.message.author),
      });
    if (author.id === this.me.id) return this.t("chats.form.reply.author.me");

    if (author.alias)
      return this.t("chats.form.reply.author.other", { name: author.alias });
    return this.t("chats.form.reply.author.other", {
      name: createFullName(author),
    });
  }

  public getReplyText() {
    if (this.message.content) return this.message.content;
    return this.t("chats.form.reply.only-files", {
      count: this.message.files.length,
    });
  }
}
