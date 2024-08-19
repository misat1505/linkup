import { AxiosError } from "axios";
import { User } from "../models/User";
import { CHAT_API } from "./utils";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import { ChatFormType } from "@/validators/chat.validators";

export const createChatBetweenUsers = async (
  user1: User["id"],
  user2: User["id"]
): Promise<Chat> => {
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

export const getUserChats = async (): Promise<Chat[]> => {
  const response = await CHAT_API.get("");
  return response.data.chats;
};

export const getChatMessages = async (
  chatId: Chat["id"]
): Promise<Message[]> => {
  const response = await CHAT_API.get(`/${chatId}/messages`);
  return response.data.messages;
};

export const createMessage = async (
  chatId: Chat["id"],
  payload: ChatFormType
): Promise<Message> => {
  const formData = new FormData();
  formData.append("content", payload.content);
  payload.files?.forEach((file) => {
    formData.append("files", file);
  });
  const response = await CHAT_API.post(`/${chatId}/messages`, formData);
  return response.data.message;
};
