import React, { createContext, PropsWithChildren, useContext } from "react";
import useChatForm, { useChatFormValue } from "../hooks/chats/useChatForm";
import { Chat } from "../types/Chat";

type ChatFooterContextProps = PropsWithChildren & {
  chatId: Chat["id"];
};

type ChatFooterContextValue = useChatFormValue;

const ChatFooterContext = createContext<ChatFooterContextValue>(
  {} as ChatFooterContextValue
);

export const useChatFooterContext = () => useContext(ChatFooterContext);

export const ChatFooterProvider = ({
  children,
  chatId
}: ChatFooterContextProps) => {
  return (
    <ChatFooterContext.Provider value={useChatForm(chatId)}>
      {children}
    </ChatFooterContext.Provider>
  );
};

export default ChatFooterProvider;
