import { Chat, Message, User } from "@packages/schemas";
import { TranslateFn } from "../config";
import { createFullName } from "./create-full-name";

export class MessageUtils {
  constructor(
    private readonly chat: Chat,
    private readonly message: Message,
    private readonly me: User,
    private readonly t: TranslateFn,
  ) {}

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
      if (responseAuthor.id === this.me.id)
        return this.t("chats.message.reply.text.you-to-you");
      return this.t("chats.message.reply.text.you-to-other", {
        name: responseDisplayName,
      });
    }

    if (responseAuthor.id === this.me.id)
      return this.t("chats.message.reply.text.other-to-you", {
        name: messageDisplayName,
      });

    if (responseAuthor.id === messageAuthor.id)
      return this.t("chats.message.reply.text.other-to-same", {
        name: messageDisplayName,
      });
    return this.t("chats.message.reply.text.other-to-other", {
      name1: messageDisplayName,
      name2: responseDisplayName,
    });
  }
}
