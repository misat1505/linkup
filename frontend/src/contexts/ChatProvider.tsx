import { Chat } from "@/types/Chat";
import { Message } from "@/types/Message";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
  useQueryClient,
} from "react-query";
import { useChatPageContext } from "./ChatPageProvider";
import { queryKeys } from "@/lib/queryKeys";
import { ChatService } from "@/services/Chat.service";
import { SocketAction, socketClient } from "@/lib/socketClient";

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
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<InfiniteQueryObserverResult<Message, unknown>>;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
};

const ChatContext = createContext<ChatContextValue>({} as ChatContextValue);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children, chatId }: ChatContextProps) => {
  const queryClient = useQueryClient();
  const messageRefs = useRef<Record<Message["id"], HTMLDivElement | null>>({});
  const [incomeMessageId, setIncomeMessageId] = useState<Message["id"] | null>(
    null
  );
  const { chats, addMessage } = useChatPageContext();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.messages(chatId),
    queryFn: ({ pageParam }) =>
      ChatService.getMessages(chatId, undefined, pageParam || null),
    getNextPageParam: (lastPage) => {
      if (lastPage.length > 0) {
        return lastPage[lastPage.length - 1].id;
      }
      return undefined;
    },
    select: (data) => ({
      pages: data.pages.flatMap((page) => page),
      pageParams: data.pageParams,
    }),
    refetchOnMount: false,
  });

  const messages = data?.pages || [];

  const incomeMessage =
    messages?.find((message) => message.id === incomeMessageId) || null;

  useEffect(() => {
    socketClient.onReceiveMessage((message) => {
      addMessage(message);
      if (message.chatId === chatId) setIncomeMessageId(message.id);
    });

    socketClient.onReceiveReaction((reaction) => {
      queryClient.setQueryData<Message[]>(
        queryKeys.messages(chat!.id),
        (oldMessages = []) => {
          const message = oldMessages.find((m) => m.id === reaction.messageId);
          if (!message) return oldMessages;

          if (message.reactions.some((r) => r.user.id === reaction.user.id))
            return oldMessages;
          message.reactions.push(reaction);
          return [...oldMessages];
        }
      );
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
        setIncomeMessageId,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
