import { getUserChats } from "../api/chatAPI";
import { Chat } from "../models/Chat";
import React, { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "react-query";

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
  const queryClient = useQueryClient();
  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getUserChats,
    refetchOnMount: true,
    onSuccess: (data) => queryClient.setQueryData<Chat[]>(["chats"], data)
  });

  return (
    <ChatPageContext.Provider value={{ chats, isLoading }}>
      {children}
    </ChatPageContext.Provider>
  );
};

export default ChatPageProvider;
