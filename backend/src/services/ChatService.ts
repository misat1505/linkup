import { prisma } from "../lib/Prisma";
import { Chat } from "../types/Chat";
import { Message } from "../types/Message";
import { User } from "../types/User";
import { v7 as uuidv7 } from "uuid";
import { userSelect } from "../utils/prisma/userSelect";
import { messageWithoutResponseSelect } from "../utils/prisma/messageWithoutResponseSelect";
import { Reaction } from "../types/Reaction";

function sanitizeChat(chat: any): Chat | null {
  if (!chat) return null;

  const { lastMessageId, ...sanitizedChat } = chat;
  return sanitizedChat as Chat;
}

export class ChatService {
  static async createReactionToMessage(data: {
    userId: User["id"];
    reactionId: string;
    messageId: Message["id"];
  }): Promise<Reaction> {
    const reactionRecord = await prisma.userReaction.create({
      data,
      include: { user: { select: userSelect }, reaction: true },
    });

    const reaction: Reaction = {
      id: reactionRecord.reaction.id,
      name: reactionRecord.reaction.name,
      messageId: reactionRecord.messageId,
      user: reactionRecord.user,
    };

    return reaction;
  }

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
    const result = await prisma.message.findMany({
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
        reactions: {
          include: {
            user: {
              select: userSelect,
            },
            reaction: true,
          },
        },
      },
    });

    const messages: Message[] = result.map((message) => ({
      id: message.id,
      content: message.content,
      author: message.author,
      createdAt: message.createdAt,
      response: message.response,
      chatId: message.chatId,
      files: message.files,
      reactions: message.reactions.map((userReaction) => ({
        id: userReaction.reaction.id,
        name: userReaction.reaction.name,
        messageId: userReaction.messageId,
        user: {
          id: userReaction.user.id,
          firstName: userReaction.user.firstName,
          lastName: userReaction.user.lastName,
          photoURL: userReaction.user.photoURL,
          lastActive: userReaction.user.lastActive,
        },
      })),
    }));

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
    const result = await prisma.message.create({
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

    const message: Message = {
      id: result.id,
      content: result.content,
      author: result.author,
      createdAt: result.createdAt,
      response: result.response,
      chatId: result.chatId,
      files: result.files,
      reactions: [],
    };

    return message;
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

    return result.map((chat) => sanitizeChat(chat)!);
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

    const chat =
      id1 !== id2
        ? result.find((chat) => chat.users?.length !== 1)
        : result.find((chat) => chat.users?.length === 1);

    return sanitizeChat(chat);
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

    return sanitizeChat(result)!;
  }

  static async createGroupChat(
    users: User["id"][],
    name: Chat["name"],
    photoURL: Chat["photoURL"]
  ): Promise<Chat> {
    const result: Chat = await prisma.chat.create({
      data: {
        type: "GROUP",
        name,
        photoURL,
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

    return sanitizeChat(result)!;
  }
}
