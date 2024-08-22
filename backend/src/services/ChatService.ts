import { prisma } from "../lib/Prisma";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { v7 as uuidv7 } from "uuid";
import { userSelect } from "../utils/prisma/userSelect";
import { messageWithoutResponseSelect } from "../utils/prisma/messageWithoutResponseSelect";

export class ChatService {
  static async isMessageInChat({
    chatId,
    messageId,
  }: {
    chatId: Chat["id"];
    messageId: Message["id"];
  }): Promise<boolean> {
    const result = await prisma.message.findFirst({
      where: { chatId, id: messageId },
    });

    return !!result;
  }

  static async getChatMessages(chatId: Chat["id"]): Promise<Message[]> {
    const result: (Message & {
      authorId: User["id"];
      responseId: Message["id"] | null;
    })[] = await prisma.message.findMany({
      where: {
        chatId,
      },
      include: {
        author: {
          select: userSelect,
        },
        response: {
          select: messageWithoutResponseSelect,
        },
        files: {
          select: { id: true, url: true },
        },
      },
    });

    const messages: Message[] = result.map(
      ({ authorId, responseId, ...message }) => ({ ...message })
    );

    return messages;
  }

  static async isUserInChat({
    userId,
    chatId,
  }: {
    userId: User["id"];
    chatId: Chat["id"];
  }): Promise<boolean> {
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        users: {
          where: {
            id: userId,
          },
        },
      },
    });

    if (!chat) return false;

    return chat.users.length !== 0;
  }

  static async createMessage({
    content,
    authorId,
    chatId,
    files,
    responseId,
  }: {
    content: Message["content"];
    authorId: User["id"];
    chatId: Chat["id"];
    files: string[];
    responseId: Message["id"] | null;
  }): Promise<Message> {
    const result: Message & {
      authorId: User["id"];
      responseId: Message["id"] | null;
    } = await prisma.message.create({
      data: {
        id: uuidv7(),
        content,
        authorId,
        chatId,
        responseId,
        files: {
          create: files.map((fileUrl) => ({
            id: uuidv7(),
            url: fileUrl,
          })),
        },
      },
      include: {
        author: {
          select: userSelect,
        },
        response: { select: messageWithoutResponseSelect },
        files: {
          select: { id: true, url: true },
        },
      },
    });

    await prisma.chat.update({
      data: { lastMessageId: result.id },
      where: { id: chatId },
    });

    const { authorId: _, responseId: rId, ...message } = result;

    return message as Message;
  }

  static async getUserChats(userId: User["id"]): Promise<Chat[]> {
    const result: Chat[] = await prisma.chat.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        users: {
          select: userSelect,
        },
        lastMessage: {
          select: messageWithoutResponseSelect,
        },
      },
    });

    return result;
  }

  static async getPrivateChatByUserIds(
    id1: string,
    id2: string
  ): Promise<Chat | null> {
    const result: Chat[] = await prisma.chat.findMany({
      where: {
        type: "PRIVATE",
        users: {
          every: {
            id: {
              in: [id1, id2],
            },
          },
        },
      },
      include: {
        users: {
          select: userSelect,
        },
        lastMessage: {
          select: messageWithoutResponseSelect,
        },
      },
    });

    if (id1 !== id2) {
      return result.filter((chat) => chat.users?.length !== 1)?.[0];
    }

    return result.filter((chat) => chat.users?.length === 1)?.[0];
  }

  static async createPrivateChat(id1: string, id2: string): Promise<Chat> {
    const result: Chat = await prisma.chat.create({
      data: {
        type: "PRIVATE",
        users: {
          connect: [{ id: id1 }, { id: id2 }],
        },
      },
      include: {
        users: {
          select: userSelect,
        },
        lastMessage: {
          select: messageWithoutResponseSelect,
        },
      },
    });

    return result;
  }

  static async createGroupChat(users: User["id"][]): Promise<Chat> {
    const result: Chat = await prisma.chat.create({
      data: {
        type: "GROUP",
        users: {
          connect: users.map((user) => ({ id: user })),
        },
      },
      include: {
        users: {
          select: userSelect,
        },
        lastMessage: {
          select: messageWithoutResponseSelect,
        },
      },
    });

    return result;
  }
}
