import { getChatMessages } from "../api/chatAPI";
import { Chat } from "../models/Chat";
import React, { createContext, PropsWithChildren, useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useChatPageContext } from "./ChatPageProvider";
import { Message } from "../models/Message";
import { queryKeys } from "../lib/queryKeys";

type ChatContextProps = PropsWithChildren & {
  chatId: Chat["id"];
};

type ChatContextValue = {
  messages: Message[] | undefined;
  isLoading: boolean;
  error: unknown;
  chat: Chat | null;
  addMessage: (message: Message) => void;
  chatId: Chat["id"];
};

const ChatContext = createContext<ChatContextValue>({} as ChatContextValue);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children, chatId }: ChatContextProps) => {
  const queryClient = useQueryClient();
  const { chats } = useChatPageContext();
  const {
    data: messages,
    isLoading,
    error
  } = useQuery({
    queryKey: queryKeys.messages(chatId),
    queryFn: () => getChatMessages(chatId),
    refetchOnMount: false
  });

  const addMessage = (message: Message): void => {
    queryClient.setQueryData<Message[]>(
      queryKeys.messages(chatId),
      (oldMessages) => {
        return oldMessages ? [...oldMessages, message] : [message];
      }
    );
  };

  const chat = chats?.find((c) => c.id === chatId) || null;

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        error,
        chat,
        addMessage,
        chatId
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
