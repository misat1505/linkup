"use client";

import { Chat, User } from "@packages/schemas";
import { FaUserGroup } from "react-icons/fa6";
import { LINK_COMPONENT, TRANSLATION_COMPONENT } from "../../../config";
import { buildFileURL, Filter } from "../../../utils/build-file-url";
import { ChatUtils } from "../../../utils/chat-utils";
import { Avatar } from "../../misc/avatar";
import { Tooltip } from "../../misc/tooltip";
import LastMessageDisplayer from "./last-message-display";

type NavigationListProps = {
  chats: Chat[];
  me: User;
};

export function NavigationList({ chats, me }: NavigationListProps) {
  return (
    <>
      {chats.map((chat) => (
        <NavigationItem key={chat.id} chat={chat} me={me} />
      ))}
    </>
  );
}

type NavigationItemProps = {
  chat: Chat;
  me: User;
};

function NavigationItem({ chat, me }: NavigationItemProps) {
  const utils = new ChatUtils(chat, me!);

  const src = utils.getImageURL()!;
  const alt =
    chat.type === "PRIVATE" ? (
      utils.getImageAlt()
    ) : (
      <FaUserGroup className="object-fit h-full w-full pt-4" />
    );
  const chatName = utils.getChatName();
  const lastActive = utils.getLastActive();

  const buildFilter = (): Filter => {
    if (chat.type === "PRIVATE") return { type: "avatar" };
    return { type: "chat-photo", id: chat.id };
  };

  return (
    <Tooltip
      content={
        <TRANSLATION_COMPONENT translationKey="chats.navigation.items.tooltip" />
      }
    >
      <span>
        <LINK_COMPONENT
          className="mx-4 mb-2 flex w-[calc(100%-2rem)] items-center gap-x-4  bg-slate-100 px-4 py-2 shadow-md transition-all hover:cursor-pointer hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 md:w-72"
          href={`/chats/${chat.id}`}
        >
          <Avatar
            src={buildFileURL(src, buildFilter())}
            className="min-h-12 min-w-12"
            alt={alt}
            lastActive={lastActive}
          />
          <div className="overflow-hidden text-left">
            <div className="overflow-hidden text-nowrap font-semibold">
              {chatName}
            </div>
            <div className="overflow-hidden text-nowrap text-sm">
              <LastMessageDisplayer
                chat={chat}
                lastMessage={chat.lastMessage}
                me={me}
              />
            </div>
          </div>
        </LINK_COMPONENT>
      </span>
    </Tooltip>
  );
}
