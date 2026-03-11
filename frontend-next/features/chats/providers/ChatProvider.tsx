"use client";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useRef,
  useState,
} from "react";
import {
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useChatPageContext } from "./ChatPageProvider";
import { queryKeys } from "@/lib/queryKeys";
import { getMessages } from "../actions/getMessages";
import { Reaction } from "../schemas/reaction";
import { Message } from "../schemas/message";
import { Chat } from "../schemas/chat";

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
  const { chats, addMessage } = useChatPageContext();

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    Message[], // page type
    Error,
    Message[], // select return type
    ReturnType<typeof queryKeys.messages>,
    string | null // pageParam type 👈 IMPORTANT
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

  const addReaction = (reaction: Reaction) => {};

  // const addReaction = (reaction: Reaction) => {
  //   queryClient.setQueryData(queryKeys.messages(chat!.id), (oldData: any) => {
  //     if (!oldData) return oldData;

  //     const newPages = oldData.pages.map((page: Message[]) =>
  //       page.map((m) => {
  //         if (m.id !== reaction.messageId) return m;

  //         const alreadyReacted = m.reactions.some(
  //           (r) => r.user.id === reaction.user.id
  //         );
  //         if (alreadyReacted) return m;

  //         return {
  //           ...m,
  //           reactions: [...m.reactions, reaction],
  //         };
  //       })
  //     );

  //     return {
  //       pages: newPages,
  //       pageParams: [...oldData.pageParams],
  //     };
  //   });
  // };

  // useEffect(() => {
  //   socketClient.onReceiveMessage((message) => {
  //     addMessage(message);
  //     if (message.chatId === chatId) setIncomeMessageId(message.id);
  //   });

  //   socketClient.onReceiveReaction((reaction) => {
  //     addReaction(reaction);
  //   });

  //   return () => {
  //     socketClient.off(SocketAction.RECEIVE_MESSAGE);
  //   };
  // }, [socketClient]);

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
