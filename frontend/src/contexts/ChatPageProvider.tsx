import { queryKeys } from "../lib/queryKeys";
import { getUserChats } from "../api/chatAPI";
import { Chat } from "../models/Chat";
import React, { createContext, useContext, useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { sortChatsByActivity } from "../utils/sortChatsByActivity";
import { useSocketContext } from "./SocketProvider";
import { useChatContext } from "./ChatProvider";
import { Message } from "@/models/Message";

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
  const { socket } = useSocketContext();
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
      if (socket) {
        data.forEach((chat) => {
          socket.emit("join-room", chat.id);
          console.log("joined: ", chat.id);
        });
      }
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
    if (!socket) return;

    socket.on("receive-message", (message) => {
      addMessage(message);
    });

    return () => {
      socket.off("receive-message");
    };
  }, [socket]);

  useEffect(() => {
    return () => {
      queryClient.getQueryData<Chat[]>(queryKeys.chats())?.forEach((chat) => {
        socket!.emit("leave-room", chat.id);
        console.log("left: ", chat.id);
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
