import { Chat } from "../types/Chat";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";
import { useQuery } from "react-query";
import { useChatPageContext } from "./ChatPageProvider";
import { Message } from "../types/Message";
import { queryKeys } from "../lib/queryKeys";
import { SocketAction, socketClient } from "../lib/socketClient";
import { ChatService } from "../services/Chat.service";

type ChatContextProps = PropsWithChildren & {
  chatId: Chat["id"];
};

type ChatContextValue = {
  messages: Message[] | undefined;
  isLoading: boolean;
  error: unknown;
  chat: Chat | null;
  chatId: Chat["id"];
  incomeMessage: Message | null;
  messageRefs: React.MutableRefObject<
    Record<Message["id"], HTMLDivElement | null>
  >;
  setIncomeMessageId: React.Dispatch<React.SetStateAction<string | null>>;
};

const ChatContext = createContext<ChatContextValue>({} as ChatContextValue);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children, chatId }: ChatContextProps) => {
  const messageRefs = useRef<Record<Message["id"], HTMLDivElement | null>>({});
  const [incomeMessageId, setIncomeMessageId] = useState<Message["id"] | null>(
    null
  );
  const { chats, addMessage } = useChatPageContext();
  const {
    data: messages,
    isLoading,
    error
  } = useQuery({
    queryKey: queryKeys.messages(chatId),
    queryFn: () => ChatService.getMessages(chatId),
    refetchOnMount: false
  });

  const incomeMessage =
    messages?.find((message) => message.id === incomeMessageId) || null;

  useEffect(() => {
    socketClient.onReceiveMessage((message) => {
      addMessage(message);
      if (message.chatId === chatId) setIncomeMessageId(message.id);
    });

    return () => {
      socketClient.off(SocketAction.RECEIVE_MESSAGE);
    };
  }, [socketClient]);

  const chat = chats?.find((c) => c.id === chatId) || null;

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        error,
        chat,
        chatId,
        incomeMessage,
        messageRefs,
        setIncomeMessageId
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
