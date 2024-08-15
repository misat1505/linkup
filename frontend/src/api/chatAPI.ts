import { AxiosError } from "axios";
import { User } from "../models/User";
import { CHAT_API } from "./utils";

export const createChatBetweenUsers = async (
  user1: User["id"],
  user2: User["id"]
): Promise<any> => {
  try {
    const body = {
      users: [user1, user2]
    };

    const response = await CHAT_API.post("/private", body);

    return response.data.chat;
  } catch (e) {
    if (e instanceof AxiosError) {
      if (e.response?.status === 409) {
        return e.response.data.chat;
      }
    }
    throw e;
  }
};

export const getUserChats = async (): Promise<any> => {
  const response = await CHAT_API.get("");
  return response.data.chats;
};

export const getChatMessages = async (chatId: string): Promise<any> => {
  const response = await CHAT_API.get(`/${chatId}/messages`);
  return response.data.messages;
};
