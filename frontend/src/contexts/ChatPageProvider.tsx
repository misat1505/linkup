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

  return (
    <ChatPageContext.Provider value={{ chats, isLoading }}>
      {children}
    </ChatPageContext.Provider>
  );
};

export default ChatPageProvider;
