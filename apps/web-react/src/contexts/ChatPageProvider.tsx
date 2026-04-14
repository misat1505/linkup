import { useToast } from "@/components/ui/use-toast";
import { queryKeys } from "@/lib/queryKeys";
import { SocketAction, socketClient, SocketErrors } from "@/lib/socketClient";
import { ChatService } from "@/services/Chat.service";
import { Chat } from "@/types/Chat";
import { Message } from "@/types/Message";
import { sortChatsByActivity } from "@/utils/sortChatsByActivity";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "react-query";

type ChatPageContextProps = {
  children: React.ReactNode;
};

type ChatPageContextValue = {
  chats: Chat[] | undefined;
  isLoading: boolean;
  addMessage: (message: Message) => void;
  createChatTriggerRef: React.RefObject<HTMLDivElement>;
};

const ChatPageContext = createContext<ChatPageContextValue>(
  {} as ChatPageContextValue
);

export const useChatPageContext = () => useContext(ChatPageContext);

export const ChatPageProvider = ({ children }: ChatPageContextProps) => {
  const { t } = useTranslation();
  const createChatTriggerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: chats, isLoading } = useQuery({
    queryKey: queryKeys.chats(),
    queryFn: ChatService.getChats,
    refetchOnMount: true,
    onSuccess: (data) => {
      queryClient.setQueryData<Chat[]>(
        queryKeys.chats(),
        sortChatsByActivity(data)
      );
      data.forEach((chat) => {
        socketClient.joinRoom(chat.id);
      });
    },
  });

  const addMessage = (message: Message): void => {
    queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
      const updatedChats = oldChats!.map((chat) => {
        if (chat.id !== message.chatId) return chat;
        chat.lastMessage = message;
        return { ...chat };
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
          (m: Message) => m.id === message.id
        );

        if (isDuplicate) {
          return oldData;
        }

        return {
          pages: [[message], ...oldData.pages],
          pageParams: [undefined, ...oldData.pageParams],
        };
      }
    );
  };

  useEffect(() => {
    socketClient.onReceiveMessage((message) => {
      addMessage(message);
    });

    socketClient.on(SocketErrors.JOINING_ROOM_ERROR, () => {
      toast({
        title: t("chats.sockets.errors.connection.toast.title"),
        description: t("chats.sockets.errors.connection.toast.description"),
        variant: "destructive",
      });
    });

    return () => {
      socketClient.off(SocketAction.RECEIVE_MESSAGE);
    };
  }, [socketClient]);

  useEffect(() => {
    return () => {
      queryClient.getQueryData<Chat[]>(queryKeys.chats())?.forEach((chat) => {
        socketClient.leaveRoom(chat.id);
      });
    };
  }, []);

  return (
    <ChatPageContext.Provider
      value={{ chats, isLoading, addMessage, createChatTriggerRef }}
    >
      {children}
    </ChatPageContext.Provider>
  );
};

export default ChatPageProvider;
