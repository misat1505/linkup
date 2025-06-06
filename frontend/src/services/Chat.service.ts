import { Chat, UserInChat } from "@/types/Chat";
import { AxiosError, HttpStatusCode } from "axios";
import { CHAT_API } from "./utils";
import { User } from "@/types/User";
import { Message } from "@/types/Message";
import { Reaction } from "@/types/Reaction";
import {
  ChatFormType,
  NewGroupChatFormType,
} from "@/validators/chat.validators";

export class ChatService {
  static async updateChat(
    chatId: Chat["id"],
    name: string | null,
    file: File | null
  ): Promise<Chat> {
    const formData = new FormData();

    if (name) formData.append("name", name);
    if (file) formData.append("file", file);

    const response = await CHAT_API.put(`${chatId}`, formData);
    return response.data.chat;
  }

  static async leaveChat(chatId: Chat["id"]): Promise<void> {
    await CHAT_API.delete(`${chatId}/users`);
  }

  static async addUserToChat(
    chatId: Chat["id"],
    userId: User["id"]
  ): Promise<UserInChat> {
    const response = await CHAT_API.post(`${chatId}/users`, { userId });
    return response.data.user;
  }

  static async updateAlias(
    chatId: Chat["id"],
    userId: User["id"],
    alias: UserInChat["alias"]
  ): Promise<void> {
    await CHAT_API.put(`/${chatId}/users/${userId}/alias`, { alias });
  }

  static async createReaction(
    messageId: Message["id"],
    reactionId: Reaction["id"],
    chatId: Chat["id"]
  ): Promise<Reaction> {
    const response = await CHAT_API.post(`/${chatId}/reactions`, {
      messageId,
      reactionId,
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
        users: [user1, user2],
      };

      const response = await CHAT_API.post("/private", body);

      return response.data.chat;
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.status === HttpStatusCode.Conflict) {
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

  static async getMessages(
    chatId: Chat["id"],
    responseId?: Message["id"] | null,
    lastMessageId?: Message["id"] | null
  ): Promise<Message[]> {
    const params = new URLSearchParams();
    if (responseId !== undefined)
      params.set("responseId", responseId || "null");
    if (lastMessageId !== undefined) {
      params.set("lastMessageId", lastMessageId || "null");
      params.set("limit", localStorage.getItem("messages-limit") || "20");
    }

    const response = await CHAT_API.get(`/${chatId}/messages`, { params });
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
