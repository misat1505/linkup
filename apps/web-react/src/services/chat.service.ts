import { apiContractClient } from "@/lib/api-contract-client";
import {
  ChatFormType,
  NewGroupChatFormType,
} from "@/validators/chat.validators";
import { Chat, Message, Reaction, User, UserInChat } from "@packages/schemas";
import { AxiosError, HttpStatusCode } from "axios";

export class ChatService {
  static async updateChat(
    chatId: Chat["id"],
    name: string | null,
    file: File | null,
  ): Promise<Chat> {
    const res = await apiContractClient.updateGroupChat({
      body: { name, file },
      params: { chatId },
    });
    return res.chat;
  }

  static async leaveChat(chatId: Chat["id"]): Promise<void> {
    await apiContractClient.deleteSelfFromGroupChat({ params: { chatId } });
  }

  static async addUserToChat(
    chatId: Chat["id"],
    userId: User["id"],
  ): Promise<UserInChat> {
    const res = await apiContractClient.addUserToGroupChat({
      body: { userId },
      params: { chatId },
    });
    return res.user;
  }

  static async updateAlias(
    chatId: Chat["id"],
    userId: User["id"],
    alias: UserInChat["alias"],
  ): Promise<void> {
    await apiContractClient.updateUserAlias({
      body: { alias },
      params: { chatId, userId },
    });
  }

  static async createReaction(
    messageId: Message["id"],
    reactionId: Reaction["id"],
    chatId: Chat["id"],
  ): Promise<Reaction> {
    const res = await apiContractClient.createReaction({
      body: { messageId, reactionId },
      params: { chatId },
    });
    return res.reaction;
  }

  static async getReactions(): Promise<Reaction[]> {
    const res = await apiContractClient.getReactions();
    // @ts-expect-error deprecated type
    return res.reactions;
  }

  static async createPrivateChat(
    user1: User["id"],
    user2: User["id"],
  ): Promise<Chat> {
    try {
      const res = await apiContractClient.createPrivateChat({
        body: { users: [user1, user2] },
      });
      return res.chat;
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
    const res = await apiContractClient.getSelfChats();
    return res.chats;
  }

  static async getMessages(
    chatId: Chat["id"],
    responseId?: Message["id"] | null,
    lastMessageId?: Message["id"] | null,
  ): Promise<Message[]> {
    const res = await apiContractClient.getChatMessages({
      params: { chatId },
      query: {
        lastMessageId,
        limit: Number(localStorage.getItem("messages-limit")) || 20,
        responseId,
      },
    });
    return res.messages;
  }

  static async createMessage(
    chatId: Chat["id"],
    payload: ChatFormType,
  ): Promise<Message> {
    const res = await apiContractClient.createMessage({
      params: { chatId },
      body: payload,
    });
    return res.message;
  }

  static async createGroupChat(payload: NewGroupChatFormType): Promise<Chat> {
    const res = await apiContractClient.createGroupChat({
      body: {
        name: payload.name ?? null,
        file: payload.file?.[0],
        users: payload.users.map((u) => u.id),
      },
    });
    return res.chat;
  }
}
