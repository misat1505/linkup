import { Chat } from "../../models/Chat";
import { getUserChats } from "../../api/chatAPI";
import React from "react";
import { useQuery } from "react-query";
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

export default function ChatNavigation() {
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getUserChats
  });

  if (isLoading) return <div className="w-80">loading...</div>;

  return (
    <div className="w-80">
      {chats?.map((chat) => <NavigationItem key={chat.id} chat={chat} />)}
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

  return (
    <button
      className="m-4 flex w-72 items-center gap-x-4 rounded-md bg-slate-100 p-4 transition-all hover:cursor-pointer hover:bg-slate-200"
      onClick={() => handleOpenChat(chat.id)}
    >
      <Avatar src={src} alt={alt} lastActive={lastActive} />
      <div className="font-semibold">{chatName}</div>
    </button>
  );
}
