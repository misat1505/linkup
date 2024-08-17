import { Chat } from "../models/Chat";

export const queryKeys = {
  searchUsers: (text: string) => ["search-users", { text }] as const,
  chats: () => ["chats"] as const,
  messages: (chatId: Chat["id"]) => ["messages", { chatId }] as const,
  me: () => ["me"] as const
};
