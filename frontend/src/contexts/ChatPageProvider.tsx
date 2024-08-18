import { queryKeys } from "../lib/queryKeys";
import { getUserChats } from "../api/chatAPI";
import { Chat } from "../models/Chat";
import React, { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { sortChatsByActivity } from "../utils/sortChatsByActivity";
import { Message } from "../models/Message";
import { SocketAction, socketClient, SocketErrors } from "../lib/socketClient";
import { useToast } from "../components/ui/use-toast";

type ChatPageContextProps = {
  children: React.ReactNode;
};

type ChatPageContextValue = {
  chats: Chat[] | undefined;
  isLoading: boolean;
  addMessage: (message: Message) => void;
};

const ChatPageContext = createContext<ChatPageContextValue>(
  {} as ChatPageContextValue
);

export const useChatPageContext = () => useContext(ChatPageContext);

export const ChatPageProvider = ({ children }: ChatPageContextProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: chats, isLoading } = useQuery({
    queryKey: queryKeys.chats(),
    queryFn: getUserChats,
    refetchOnMount: true,
    onSuccess: (data) => {
      queryClient.setQueryData<Chat[]>(
        queryKeys.chats(),
        sortChatsByActivity(data)
      );
      data.forEach((chat) => {
        socketClient.joinRoom(chat.id);
      });
    }
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

    queryClient.setQueryData<Message[]>(
      queryKeys.messages(message.chatId),
      (oldMessages) => {
        return oldMessages ? [...oldMessages, message] : [message];
      }
    );
  };

  useEffect(() => {
    socketClient.onReceiveMessage((message) => {
      addMessage(message);
    });

    socketClient.on(SocketErrors.JOINING_ROOM_ERROR, () => {
      toast({
        title: "Cannot join chat room.",
        description:
          "You will not be able to see real time sent messages. Try reloading the page.",
        variant: "destructive"
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
    <ChatPageContext.Provider value={{ chats, isLoading, addMessage }}>
      {children}
    </ChatPageContext.Provider>
  );
};

export default ChatPageProvider;
