"use client";

import { User } from "@/features/auth/schemas/user";
import { Chat } from "../schemas/chat";
import { ChatUtils } from "../utils/chatUtils";
import { useLanguageContext } from "@/providers/LanguageProvider";

export default function LastMessageDisplayer({
  lastMessage,
  chat,
  me,
}: {
  lastMessage: Chat["lastMessage"];
  chat: Chat;
  me: User;
}) {
  const { t } = useLanguageContext();

  if (!lastMessage) return null;

  const utils = new ChatUtils(chat, me);

  const displayName = utils.getNavigationLastMessageDisplayName(
    t("common.you"),
  );

  if (lastMessage.content)
    return (
      <>
        <span className="font-semibold">{displayName}: </span>
        <span>{lastMessage.content}</span>
      </>
    );

  return (
    <span>
      {t("chats.navigation.items.only-file-text", {
        fullName: String(displayName),
        count: String(lastMessage.files.length),
      })}
    </span>
  );
}
