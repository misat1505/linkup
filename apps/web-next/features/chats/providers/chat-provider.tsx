"use client";
import { queryKeys } from "@/lib/query-keys";
import { SocketAction, socketClient } from "@/lib/socket-client";
import { Chat, Message, Reaction } from "@packages/schemas";
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { getMessages } from "../actions/get-messages";
import { useChatPageContext } from "./chat-page-provider";

type ChatContextProps = PropsWithChildren & {
  chat: Chat;
};

type ChatContextValue = {
  messages: Message[] | undefined;
  isLoading: boolean;
  error: unknown;
  chat: ChatContextProps["chat"];
  chatId: Chat["id"];
  incomeMessage: Message | null;
  messageRefs: React.MutableRefObject<
    Record<Message["id"], HTMLDivElement | null>
  >;
  setIncomeMessageId: React.Dispatch<React.SetStateAction<string | null>>;
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<Message[], Error>>;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  addReaction: (reaction: Reaction) => void;
};

const ChatContext = createContext<ChatContextValue>({} as ChatContextValue);

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children, chat }: ChatContextProps) => {
  const queryClient = useQueryClient();
  const messageRefs = useRef<Record<Message["id"], HTMLDivElement | null>>({});
  const [incomeMessageId, setIncomeMessageId] = useState<Message["id"] | null>(
    null,
  );
  const { addMessage } = useChatPageContext();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    Message[],
    Error,
    Message[],
    ReturnType<typeof queryKeys.messages>,
    string | null
  >({
    queryKey: queryKeys.messages(chat.id),
    queryFn: ({ pageParam }) =>
      getMessages(chat.id, undefined, pageParam || null),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (lastPage.length > 0) {
        return lastPage[lastPage.length - 1].id;
      }
      return undefined;
    },
    select: (data) => data.pages.flat(),
    refetchOnMount: false,
  });

  const messages = data || [];

  const incomeMessage =
    messages?.find((message) => message.id === incomeMessageId) || null;

  const addReaction = useCallback(
    (reaction: Reaction) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryClient.setQueryData(queryKeys.messages(chat!.id), (oldData: any) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page: Message[]) =>
          page.map((m) => {
            if (m.id !== reaction.messageId) return m;

            const alreadyReacted = m.reactions.some(
              (r) => r.user.id === reaction.user.id,
            );
            if (alreadyReacted) return m;

            return {
              ...m,
              reactions: [...m.reactions, reaction],
            };
          }),
        );

        return {
          pages: newPages,
          pageParams: [...oldData.pageParams],
        };
      });
    },
    [chat, queryClient],
  );

  useEffect(() => {
    socketClient.onReceiveMessage((message) => {
      addMessage(message);
      if (message.chatId === chat.id) setIncomeMessageId(message.id);
    });

    socketClient.onReceiveReaction((reaction) => {
      addReaction(reaction);
    });

    return () => {
      socketClient.off(SocketAction.RECEIVE_MESSAGE);
    };
  }, [addMessage, chat.id, addReaction]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        error,
        chat,
        chatId: chat.id,
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
