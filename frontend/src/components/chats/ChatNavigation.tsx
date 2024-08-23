import { Chat } from "../../models/Chat";
import React from "react";
import { useAppContext } from "../../contexts/AppProvider";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import Avatar from "../common/Avatar";
import { ChatUtils } from "../../utils/chatUtils";
import { useChatPageContext } from "../../contexts/ChatPageProvider";
import { FaUserGroup } from "react-icons/fa6";
import ChatCreator from "./chatCreationDialog/ChatCreator";
import { cn } from "../../lib/utils";

export default function ChatNavigation() {
  const { chatId } = useParams();
  const { chats, isLoading } = useChatPageContext();

  const classnames = cn("w-full md:w-80", { "hidden md:block": !!chatId });

  if (isLoading) return <div className={classnames}>loading...</div>;

  return (
    <div className={classnames}>
      <ChatNavigationHeader />
      <div className="no-scrollbar h-[calc(100vh-8rem)] overflow-auto">
        {chats?.map((chat) => <NavigationItem key={chat.id} chat={chat} />)}
      </div>
    </div>
  );
}

function ChatNavigationHeader() {
  return (
    <div className="flex w-full items-center justify-between bg-transparent px-4 py-2 text-white">
      <h2 className="text-lg font-semibold">Chat with others</h2>
      <ChatCreator />
    </div>
  );
}

function NavigationItem({ chat }: { chat: Chat }) {
  const navigate = useNavigate();
  const { user: me } = useAppContext();

  if (!me) throw new Error();

  const utils = new ChatUtils(chat, me);

  const handleOpenChat = (chatId: Chat["id"]) => {
    navigate(ROUTES.CHAT_DETAIL.buildPath({ chatId }));
  };

  const src = utils.getImageURL()!;
  const alt =
    chat.type === "PRIVATE" ? (
      utils.getImageAlt()
    ) : (
      <FaUserGroup className="object-fit h-full w-full pt-4" />
    );
  const chatName = utils.getChatName();
  const lastActive = utils.getLastActive();

  return (
    <button
      className="mx-4 mb-2 flex w-[calc(100%-2rem)] items-center gap-x-4 rounded-md bg-slate-100 px-4 py-2 transition-all hover:cursor-pointer hover:bg-slate-200 md:w-72"
      onClick={() => handleOpenChat(chat.id)}
    >
      <Avatar src={src} alt={alt} lastActive={lastActive} />
      <div className="overflow-hidden text-left">
        <div className="overflow-hidden text-nowrap font-semibold">
          {chatName}
        </div>
        <div className="text-sm">
          <LastMessageDisplayer lastMessage={chat.lastMessage} />
        </div>
      </div>
    </button>
  );
}

function LastMessageDisplayer({
  lastMessage
}: {
  lastMessage: Chat["lastMessage"];
}) {
  const { user: me } = useAppContext();

  if (!lastMessage) return null;

  const displayName =
    lastMessage.author.id === me!.id ? "You" : lastMessage.author.firstName;

  if (lastMessage.content)
    return (
      <>
        <span className="font-semibold">{displayName}: </span>
        <span>{lastMessage.content?.substring(0, 20)}</span>
      </>
    );

  return (
    <span>
      {displayName} sent {lastMessage.files.length} file(s).
    </span>
  );
}
