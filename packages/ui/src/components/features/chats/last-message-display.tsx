"use client";

import { Chat, User } from "@packages/schemas";
import { TRANSLATION_COMPONENT, useUiPackageContext } from "../../../config";
import { ChatUtils } from "../../../utils/chat-utils";

export default function LastMessageDisplayer({
  lastMessage,
  chat,
  me,
}: {
  lastMessage: Chat["lastMessage"];
  chat: Chat;
  me: User;
}) {
  const { t } = useUiPackageContext();

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
      <TRANSLATION_COMPONENT
        translationKey="chats.navigation.items.only-file-text"
        values={{
          fullName: String(displayName),
          count: String(lastMessage.files.length),
        }}
      />
    </span>
  );
}
