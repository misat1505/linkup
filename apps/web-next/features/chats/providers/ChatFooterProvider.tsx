"use client";

import { createContext, PropsWithChildren, useContext } from "react";
import { Chat } from "../schemas/chat";
import useChatForm, { useChatFormValue } from "../hooks/useChatForm";

type ChatFooterContextProps = PropsWithChildren & {
  chatId: Chat["id"];
};

type ChatFooterContextValue = useChatFormValue;

const ChatFooterContext = createContext<ChatFooterContextValue>(
  {} as ChatFooterContextValue,
);

export const useChatFooterContext = () => useContext(ChatFooterContext);

export const ChatFooterProvider = ({
  children,
  chatId,
}: ChatFooterContextProps) => {
  return (
    <ChatFooterContext.Provider value={useChatForm(chatId)}>
      {children}
    </ChatFooterContext.Provider>
  );
};

export default ChatFooterProvider;
