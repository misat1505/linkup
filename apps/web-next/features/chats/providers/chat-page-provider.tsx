"use client";

import { queryKeys } from "@/lib/query-keys";
import { socketClient, SocketErrors } from "@/lib/socket-client";
import { useLanguageContext } from "@/providers/language-provider";
import { Chat, Message } from "@packages/schemas";
import { toast } from "@packages/ui/components/shadcn/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { sortChatsByActivity } from "../utils/sort-chats-by-activity";

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
  const queryClient = useQueryClient();

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
