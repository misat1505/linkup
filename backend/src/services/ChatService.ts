import { prisma } from "../lib/Prisma";
import { Chat } from "../models/Chat";
import { Message } from "../models/Message";
import { User } from "../models/User";
import { v7 as uuidv7 } from "uuid";

export class ChatService {
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

    return !!chat;
  }

  static async createMessage({
    content,
    authorId,
    chatId,
  }: {
    content: Message["content"];
    authorId: User["id"];
    chatId: Chat["id"];
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
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            lastActive: true,
            photoURL: true,
          },
        },
        response: {
          select: {
            id: true,
            content: true,
            author: true,
            createdAt: true,
            chatId: true,
          },
        },
      },
    });

    const { authorId: _, responseId, ...message } = result;

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
          select: {
            id: true,
            firstName: true,
            lastName: true,
            lastActive: true,
            photoURL: true,
          },
        },
      },
    });

    return result;
  }

  static async getPrivateChatByUserIds(
    id1: string,
    id2: string
  ): Promise<Chat | null> {
    const result: Chat | null = await prisma.chat.findFirst({
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
          select: {
            id: true,
            firstName: true,
            lastName: true,
            lastActive: true,
            photoURL: true,
          },
        },
      },
    });

    return result;
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
          select: {
            id: true,
            firstName: true,
            lastName: true,
            lastActive: true,
            photoURL: true,
          },
        },
      },
    });

    return result;
  }
}
