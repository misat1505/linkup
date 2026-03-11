"use client";

import { buildFileURL, Filter } from "@/utils/buildFileURL";
import { Chat } from "../schemas/chat";
import { FaUserGroup } from "react-icons/fa6";
import Tooltip from "@/components/shared/Tooltip";
import Avatar from "@/components/shared/Avatar";
import { I18nText } from "@/components/shared/I18nText";
import Link from "next/link";
import { ChatUtils } from "../utils/chatUtils";
import LastMessageDisplayer from "./LastMessageDisplay";
import { useAppContext } from "@/providers/AppProvider";
import { useChatPageContext } from "../providers/ChatPageProvider";

export default function NavigationList() {
  const { chats } = useChatPageContext();

  return (
    <>
      {chats.map((chat) => (
        <NavigationItem key={chat.id} chat={chat} />
      ))}
    </>
  );
}

function NavigationItem({ chat }: { chat: Chat }) {
  const { user: me } = useAppContext();

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
      content={<I18nText translationKey="chats.navigation.items.tooltip" />}
    >
      <span>
        <Link
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
                me={me!}
              />
            </div>
          </div>
        </Link>
      </span>
    </Tooltip>
  );
}
