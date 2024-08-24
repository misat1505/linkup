import { AxiosError } from "axios";
import { User } from "../models/User";
import { CHAT_API } from "./utils";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import {
  ChatFormType,
  NewGroupChatFormType
} from "../validators/chat.validators";
import { Reaction } from "../models/Reaction";

export class ChatService {
  static async createReaction(
    messageId: Message["id"],
    reactionId: Reaction["id"],
    chatId: Chat["id"]
  ): Promise<Reaction> {
    const response = await CHAT_API.post(`/${chatId}/reactions`, {
      messageId,
      reactionId
    });
    return response.data.reaction;
  }

  static async getReactions(): Promise<Reaction[]> {
    const response = await CHAT_API.get("/reactions");
    return response.data.reactions;
  }

  static async createPrivateChat(
    user1: User["id"],
    user2: User["id"]
  ): Promise<Chat> {
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
  }

  static async getChats(): Promise<Chat[]> {
    const response = await CHAT_API.get("");
    return response.data.chats;
  }

  static async getMessages(chatId: Chat["id"]): Promise<Message[]> {
    const response = await CHAT_API.get(`/${chatId}/messages`);
    return response.data.messages;
  }

  static async createMessage(
    chatId: Chat["id"],
    payload: ChatFormType
  ): Promise<Message> {
    const formData = new FormData();
    formData.append("content", payload.content);
    if (payload.responseId) formData.append("responseId", payload.responseId);

    payload.files?.forEach((file) => {
      formData.append("files", file);
    });
    const response = await CHAT_API.post(`/${chatId}/messages`, formData);
    return response.data.message;
  }

  static async createGroupChat(payload: NewGroupChatFormType): Promise<Chat> {
    const { users, file, name } = payload;
    const formData = new FormData();

    if (name) formData.append("name", name);
    if (file) formData.append("file", file?.[0]);

    users.forEach((user) => {
      formData.append("users[]", user.id);
    });

    const response = await CHAT_API.post(`/group`, formData);
    return response.data.chat;
  }
}
