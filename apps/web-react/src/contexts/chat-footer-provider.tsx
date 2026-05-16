import useChatForm, { useChatFormValue } from "@/hooks/chats/use-chat-form";
import { Chat } from "@packages/schemas";
import { createContext, PropsWithChildren, useContext } from "react";

type ChatFooterContextProps = PropsWithChildren & {
  chatId: Chat["id"];
};

type ChatFooterContextValue = useChatFormValue;

const ChatFooterContext = createContext<ChatFooterContextValue>(
  {} as ChatFooterContextValue,
);

// eslint-disable-next-line react-refresh/only-export-components
export const useChatFooterContext = () => useContext(ChatFooterContext);

const ChatFooterProvider = ({ children, chatId }: ChatFooterContextProps) => {
  return (
    <ChatFooterContext.Provider value={useChatForm(chatId)}>
      {children}
    </ChatFooterContext.Provider>
  );
};

export default ChatFooterProvider;
