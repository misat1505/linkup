"use client";

import { Chat, User } from "@packages/schemas";
import { FaUserGroup } from "react-icons/fa6";
import { buildFileURL, Filter } from "../../../utils/build-file-url";
import { ChatUtils } from "../../../utils/chat-utils";
import { Avatar } from "../../misc/avatar";

type ChatHeaderAvatarProps = { chat: Chat; me: User };

export function ChatHeaderAvatar({ chat, me }: ChatHeaderAvatarProps) {
  const utils = new ChatUtils(chat, me);

  const src = utils.getImageURL()!;
  const alt =
    chat.type === "PRIVATE" ? (
      utils.getImageAlt()
    ) : (
      <FaUserGroup className="object-fit h-full w-full pt-4" />
    );
  const lastActive = utils.getLastActive();

  const buildFilter = (): Filter => {
    if (chat.type === "PRIVATE") return { type: "avatar" };
    return { type: "chat-photo", id: chat.id };
  };

  return (
    <Avatar
      src={buildFileURL(src, buildFilter())}
      alt={alt}
      lastActive={lastActive}
    />
  );
}
