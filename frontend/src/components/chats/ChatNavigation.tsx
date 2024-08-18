import { Chat } from "../../models/Chat";
import React from "react";
import { useAppContext } from "../../contexts/AppProvider";
import { API_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/routes";
import Avatar from "../common/Avatar";
import {
  getChatName,
  getImageAlt,
  getImageURL,
  getLastActive
} from "../../utils/chatNavigationUtils";
import { IoIosAddCircleOutline } from "react-icons/io";
import { useChatPageContext } from "../../contexts/ChatPageProvider";

export default function ChatNavigation() {
  const { chats, isLoading } = useChatPageContext();

  if (isLoading) return <div className="w-80">loading...</div>;

  return (
    <div className="w-80">
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
      <button>
        <IoIosAddCircleOutline
          size={20}
          className="transition-all hover:scale-125 hover:cursor-pointer"
        />
      </button>
    </div>
  );
}

function NavigationItem({ chat }: { chat: Chat }) {
  const navigate = useNavigate();
  const { user: me } = useAppContext();

  if (!me) throw new Error();

  const handleOpenChat = (chatId: Chat["id"]) => {
    navigate(ROUTES.CHAT_DETAIL.buildPath({ chatId }));
  };

  const src = `${API_URL}/files/${getImageURL({ me, chat })!}`;
  const alt = getImageAlt({ me, chat });
  const chatName = getChatName({ me, chat });
  const lastActive = getLastActive({ me, chat });

  const humanizeLastMessage = (chat: Chat): string => {
    if (!chat.lastMessage) return "";

    const displayName =
      chat.lastMessage.author.id === me.id
        ? "You"
        : chat.lastMessage.author.firstName;
    return `${displayName}: ${chat.lastMessage.content?.slice(0, 20)}`;
  };

  return (
    <button
      className="mx-4 mb-2 flex w-72 items-center gap-x-4 rounded-md bg-slate-100 px-4 py-2 transition-all hover:cursor-pointer hover:bg-slate-200"
      onClick={() => handleOpenChat(chat.id)}
    >
      <Avatar src={src} alt={alt} lastActive={lastActive} />
      <div className="text-left">
        <div className="font-semibold">{chatName}</div>
        <div className="text-sm">{humanizeLastMessage(chat)}</div>
      </div>
    </button>
  );
}
