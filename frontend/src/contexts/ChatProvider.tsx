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
import { Reaction } from "@/types/Reaction";

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
  addReaction: (reaction: Reaction) => void;
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

  const addReaction = (reaction: Reaction) => {
    queryClient.setQueryData(queryKeys.messages(chat!.id), (oldData: any) => {
      if (!oldData) return oldData;

      const newPages = oldData.pages.map((page: any) => [...page]);

      let messageFound = false;
      for (const page of newPages) {
        const message = page.find((m: Message) => m.id === reaction.messageId);
        if (message) {
          if (
            !message.reactions.some(
              (r: Reaction) => r.user.id === reaction.user.id
            )
          ) {
            message.reactions.push(reaction);
          }
          messageFound = true;
          break;
        }
      }

      if (!messageFound) return oldData;

      return {
        pages: newPages,
        pageParams: [...oldData.pageParams],
      };
    });
  };

  useEffect(() => {
    socketClient.onReceiveMessage((message) => {
      addMessage(message);
      if (message.chatId === chatId) setIncomeMessageId(message.id);
    });

    socketClient.onReceiveReaction((reaction) => {
      addReaction(reaction);
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
        addReaction,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
