import { getUserChats } from "../api/chatAPI";
import { Chat } from "../models/Chat";
import React, { createContext, useContext } from "react";
import { useQuery } from "react-query";

type ChatPageContextProps = {
  children: React.ReactNode;
};

type ChatPageContextValue = {
  chats: Chat[] | undefined;
  isLoading: boolean;
  getChatById: (chatId: Chat["id"]) => Chat | null;
};

const ChatPageContext = createContext<ChatPageContextValue>(
  {} as ChatPageContextValue
);

export const useChatPageContext = () => useContext(ChatPageContext);

export const ChatPageProvider = ({ children }: ChatPageContextProps) => {
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getUserChats
  });

  const getChatById = (chatId: Chat["id"]): Chat | null => {
    return chats?.find((chat) => chat.id === chatId) || null;
  };

  return (
    <ChatPageContext.Provider value={{ chats, isLoading, getChatById }}>
      {children}
    </ChatPageContext.Provider>
  );
};

export default ChatPageProvider;
