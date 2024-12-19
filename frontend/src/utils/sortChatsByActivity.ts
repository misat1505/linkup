import { Chat } from "@/types/Chat";

function getChatLastActivity(chat: Chat): Date {
  return chat.lastMessage ? chat.lastMessage.createdAt : chat.createdAt;
}

export function sortChatsByActivity(chats: Chat[]): Chat[] {
  const sortedChats = chats.slice().sort((chat1, chat2) => {
    const chat1LastActivity = getChatLastActivity(chat1);
    const chat2LastActivity = getChatLastActivity(chat2);
    return chat2LastActivity.getTime() - chat1LastActivity.getTime();
  });

  return sortedChats;
}
