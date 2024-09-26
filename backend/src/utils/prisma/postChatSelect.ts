import { Chat } from "../../types/Chat";

export const postChatSelect = {
  id: true,
  createdAt: true,
  type: true,
} as const;

export function transformPostChatSelect(selectedChat: {
  id: Chat["id"];
  createdAt: Chat["createdAt"];
  type: Chat["type"];
}): Chat {
  const chat: Chat = {
    id: selectedChat.id,
    createdAt: selectedChat.createdAt,
    type: selectedChat.type,
    name: null,
    photoURL: null,
    users: null,
    lastMessage: null,
  };

  return chat;
}
