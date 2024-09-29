import { Post } from "../types/Post";
import { Chat } from "../types/Chat";
import { Message } from "../types/Message";

export const queryKeys = {
  searchUsers: (text: string) => ["search-users", { text }] as const,
  chats: () => ["chats"] as const,
  messages: (chatId: Chat["id"], responseId?: Message["id"] | null) =>
    ["messages", { chatId, responseId }] as const,
  me: () => ["me"] as const,
  reactions: () => ["reactions"] as const,
  cache: () => ["cache"] as const,
  myPosts: () => ["my-posts"] as const,
  posts: () => ["posts"] as const,
  post: (postId: Post["id"]) => ["posts", { postId }] as const,
  downloadFile: (url: string) => ["download-file", { url }] as const,
  file: (url: string) => ["file", { url }] as const
};
