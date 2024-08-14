import { prisma } from "../lib/Prisma";
import { Chat } from "../models/Chat";
import { User } from "../models/User";

export class ChatService {
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
