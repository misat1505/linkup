"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Chat } from "../schemas/chat";
import { Message } from "../schemas/message";
import { sortChatsByActivity } from "../utils/sortChatsByActivity";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { socketClient, SocketErrors } from "@/lib/socketClient";
import { toast } from "@/components/ui/use-toast";
import { useLanguageContext } from "@/providers/LanguageProvider";

type ChatPageContextProps = {
  children: React.ReactNode;
  chats: Chat[];
};

type ChatPageContextValue = {
  chats: Chat[];
  addMessage: (message: Message) => void;
  createChatTriggerRef: React.RefObject<HTMLDivElement | null>;
};

const ChatPageContext = createContext<ChatPageContextValue>(
  {} as ChatPageContextValue,
);

export const useChatPageContext = () => useContext(ChatPageContext);

export const ChatPageProvider = ({
  children,
  chats: chatsArg,
}: ChatPageContextProps) => {
  const { t } = useLanguageContext();
  const [chats, setChats] = useState(sortChatsByActivity(chatsArg));
  const createChatTriggerRef = useRef<HTMLDivElement>(null);
  // const { toast } = useToast();
  const queryClient = useQueryClient();
  // const { data: chats, isLoading } = useQuery({
  //   queryKey: queryKeys.chats(),
  //   queryFn: ChatService.getChats,
  //   refetchOnMount: true,
  //   onSuccess: (data) => {
  //     queryClient.setQueryData<Chat[]>(
  //       queryKeys.chats(),
  //       sortChatsByActivity(data)
  //     );
  //     data.forEach((chat) => {
  //       socketClient.joinRoom(chat.id);
  //     });
  //   },
  // });

  const addMessage = useCallback(
    (message: Message): void => {
      setChats((prev) => {
        const updatedChats = prev.map((c) => {
          if (c.id !== message.chatId) return c;
          c.lastMessage = message;
          return c;
        });
        return sortChatsByActivity(updatedChats);
      });

      queryClient.setQueryData(
        queryKeys.messages(message.chatId),
        (oldData: any) => {
          if (!oldData) {
            return {
              pages: [[message]],
              pageParams: [undefined],
            };
          }

          const allMessages = oldData.pages.flat();
          const isDuplicate = allMessages.some(
            (m: Message) => m.id === message.id,
          );

          if (isDuplicate) {
            return oldData;
          }

          return {
            pages: [[message], ...oldData.pages],
            pageParams: [undefined, ...oldData.pageParams],
          };
        },
      );
    },
    [queryClient],
  );

  useEffect(() => {
    socketClient.on(SocketErrors.JOINING_ROOM_ERROR, () => {
      toast({
        title: t("chats.sockets.errors.connection.toast.title"),
        description: t("chats.sockets.errors.connection.toast.description"),
        variant: "destructive",
      });
    });
  }, [t]);

  useEffect(() => {
    chatsArg.forEach((chat) => {
      socketClient.joinRoom(chat.id);
    });

    return () => {
      chatsArg.forEach((chat) => {
        socketClient.leaveRoom(chat.id);
      });
    };
  }, [chatsArg]);

  return (
    <ChatPageContext.Provider
      value={{ createChatTriggerRef, addMessage, chats }}
    >
      {children}
    </ChatPageContext.Provider>
  );
};

export default ChatPageProvider;
