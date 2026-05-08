"use client";

import { Chat } from "@packages/schemas";
import { createContext, PropsWithChildren, useContext } from "react";
import useChatForm, { useChatFormValue } from "../hooks/use-chat-form";

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
