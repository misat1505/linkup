import { Chat } from "../../models/Chat";
import { getUserChats } from "../../api/chatAPI";
import React from "react";
import { useQuery } from "react-query";
import Image from "../common/Image";
import { useAppContext } from "../../contexts/AppProvider";
import { User } from "../../models/User";
import { API_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../lib/routes";

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

  const getImageURL = (): User["photoURL"] => {
    if (chat.type === "PRIVATE") {
      if (chat.users?.length === 1 && chat.users![0].id === me!.id)
        return me!.photoURL;
      const otherUser = chat.users!.find((user) => user.id !== me!.id);
      return otherUser!.photoURL;
    }
    return null;
  };

  const getChatName = (): string => {
    if (chat.type === "PRIVATE") {
      if (chat.users?.length === 1 && chat.users![0].id === me!.id)
        return `${me!.firstName} ${me!.lastName}`;
      const otherUser = chat.users!.find((user) => user.id !== me!.id);
      return `${otherUser!.firstName} ${otherUser!.lastName}`;
    }
    return "";
  };

  const getImageAlt = (): string => {
    if (chat.type === "PRIVATE") {
      if (chat.users?.length === 1 && chat.users![0].id === me!.id)
        return `${me!.firstName.toUpperCase()[0]}${me!.lastName.toUpperCase()[0]}`;
      const otherUser = chat.users!.find((user) => user.id !== me!.id);
      return `${otherUser!.firstName.toUpperCase()[0]}${otherUser!.lastName.toUpperCase()[0]}`;
    }
    return "";
  };

  const handleOpenChat = (chatId: Chat["id"]) => {
    navigate(ROUTES.CHAT_DETAIL.buildPath({ chatId }));
  };

  return (
    <button
      className="m-4 flex w-72 items-center gap-x-4 rounded-md bg-slate-100 p-4 transition-all hover:cursor-pointer hover:bg-slate-200"
      onClick={() => handleOpenChat(chat.id)}
    >
      <Image
        src={`${API_URL}/files/${getImageURL()!}`}
        className={{
          common: "h-12 w-12 rounded-full object-cover",
          error: "bg-white font-semibold"
        }}
        errorContent={getImageAlt()}
      />
      <div className="font-semibold">{getChatName()}</div>
    </button>
  );
}
