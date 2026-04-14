import { Chat, UserInChat } from "@/types/Chat";
import { Message } from "@/types/Message";
import { User } from "@/types/User";
import { v7 as uuidv7 } from "uuid";
import { userSelect } from "@/utils/prisma/userSelect";
import { messageWithoutResponseSelect } from "@/utils/prisma/messageWithoutResponseSelect";
import { Reaction } from "@/types/Reaction";
import { PrismaClientOrTransaction } from "@/types/Prisma";

function sanitizeChat(chat: any): Chat | null {
  if (!chat) return null;

  chat.users = chat.users.map(({ alias, user }: any) => ({
    alias,
    ...user,
  }));
  return chat as Chat;
}

function sanitizeMessage(message: any): Message {
  message.reactions = message.reactions.map(({ reaction, ...rest }: any) => ({
    ...rest,
    ...reaction,
  }));
  return message;
}

/**
 * Service class responsible for managing chat-related operations in database using Prisma.
 */
export class ChatService {
  private prisma: PrismaClientOrTransaction;

  constructor(prisma: PrismaClientOrTransaction) {
    this.prisma = prisma;
  }
  /**
   * Retrieves a chat by its ID.
   * @param id - The ID of the chat to retrieve.
   * @returns The chat object, or null if not found.
   */
  async getChatById(id: Chat["id"]): Promise<Chat | null> {
    const result = await this.prisma.chat.findFirst({
      where: { id },
      include: {
        users: {
          include: {
            user: { select: userSelect },
          },
        },
        lastMessage: {
          select: messageWithoutResponseSelect,
        },
      },
    });

    if (!result) return null;

    return Chat.parse(sanitizeChat(result));
  }

  /**
   * Updates the details of a group chat (name and photo URL).
   * @param chatId - The ID of the chat to update.
   * @param name - The new name of the chat.
   * @param file - The new photo URL of the chat.
   * @returns The updated chat object, or null if not found.
   */
  async updateGroupChat({
    chatId,
    name,
    file,
  }: {
    chatId: Chat["id"];
    name: Chat["name"];
    file: Chat["photoURL"];
  }): Promise<Chat | null> {
    const result = await this.prisma.chat.update({
      data: { name, photoURL: file },
      where: { id: chatId },
      include: {
        users: {
          include: {
            user: { select: userSelect },
          },
        },
        lastMessage: {
          select: messageWithoutResponseSelect,
        },
      },
    });

    return Chat.parse(sanitizeChat(result));
  }

  /**
   * Removes a user from a chat.
   * @param chatId - The ID of the chat.
   * @param userId - The ID of the user to remove.
   */
  async deleteFromChat({
    chatId,
    userId,
  }: {
    userId: User["id"];
    chatId: Chat["id"];
  }): Promise<void> {
    await this.prisma.userChat.delete({
      where: {
        userId_chatId: { chatId, userId },
      },
    });
  }

  /**
   * Retrieves the type of a chat (e.g., GROUP, PRIVATE).
   * @param id - The ID of the chat.
   * @returns The chat type, or null if not found.
   */
  async getChatType(id: Chat["id"]): Promise<Chat["type"] | null> {
    const result = await this.prisma.chat.findFirst({
      where: { id },
      select: { type: true },
    });

    return result ? result.type : null;
  }

  /**
   * Adds a user to a chat.
   * @param chatId - The ID of the chat to join.
   * @param userId - The ID of the user to add to the chat.
   * @returns The user object that was added to the chat.
   */
  async addUserToChat({
    chatId,
    userId,
  }: {
    chatId: Chat["id"];
    userId: User["id"];
  }): Promise<UserInChat> {
    const result = await this.prisma.userChat.create({
      data: { chatId, userId },
      include: {
        user: { select: userSelect },
      },
    });

    const user = { ...result.user, alias: null };
    return UserInChat.parse(user);
  }

  /**
   * Updates the alias of a user in a chat.
   * @param userId - The ID of the user whose alias is being updated.
   * @param chatId - The ID of the chat.
   * @param alias - The new alias for the user in the chat.
   */
  async updateAlias({
    userId,
    chatId,
    alias,
  }: {
    userId: User["id"];
    chatId: Chat["id"];
    alias: UserInChat["alias"];
  }): Promise<void> {
    await this.prisma.userChat.update({
      where: {
        userId_chatId: {
          userId: userId,
          chatId: chatId,
        },
      },
      data: {
        alias: alias,
      },
    });
  }

  /**
   * Creates a reaction to a message.
   * @param data - The user ID, reaction ID, and message ID to create a reaction for.
   * @returns The created reaction object.
   */
  async createReactionToMessage(data: {
    userId: User["id"];
    reactionId: string;
    messageId: Message["id"];
  }): Promise<Reaction> {
    const reactionRecord = await this.prisma.userReaction.create({
      data,
      include: { user: { select: userSelect }, reaction: true },
    });

    const reaction: Reaction = {
      id: reactionRecord.reaction.id,
      name: reactionRecord.reaction.name,
      messageId: reactionRecord.messageId,
      user: reactionRecord.user,
    };

    return Reaction.parse(reaction);
  }

  /**
   * Checks if a message belongs to a specific chat.
   * @param chatId - The ID of the chat.
   * @param messageId - The ID of the message.
   * @returns True if the message exists in the chat, otherwise false.
   */
  async isMessageInChat({
    chatId,
    messageId,
  }: {
    chatId: Chat["id"];
    messageId: Message["id"];
  }): Promise<boolean> {
    const result = await this.prisma.message.findFirst({
      where: { chatId, id: messageId },
    });

    return !!result;
  }

  /**
   * Retrieves all messages in a chat, optionally filtering by response ID.
   * @param chatId - The ID of the chat to fetch messages for.
   * @param responseId - Optionally, the ID of the parent message to filter by.
   * @returns A list of messages in the chat.
   */
  async getPostChatMessages(
    chatId: Chat["id"],
    responseId: Message["id"] | null
  ): Promise<Message[]> {
    const result = await this.prisma.message.findMany({
      where: {
        chatId,
        responseId,
      },
      include: {
        author: { select: userSelect },
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

    return result.map((m) => Message.parse(sanitizeMessage(m)));
  }

  async getChatMessages(
    chatId: Chat["id"],
    lastMessageId: Message["id"] | undefined = undefined,
    limit: number | undefined = undefined
  ): Promise<Message[]> {
    const lastMessage = lastMessageId
      ? await this.prisma.message.findFirst({
          where: { id: lastMessageId },
        })
      : null;

    if (lastMessage && lastMessage.chatId !== chatId)
      throw new Error("Message not in chat.");

    const result = await this.prisma.message.findMany({
      where: {
        chatId,
        createdAt: lastMessage ? { lt: lastMessage.createdAt } : undefined,
      },
      include: {
        author: { select: userSelect },
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
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return result.map((m) => Message.parse(sanitizeMessage(m)));
  }

  /**
   * Checks if a user is part of a specific chat.
   * @param userId - The ID of the user to check.
   * @param chatId - The ID of the chat to check.
   * @returns True if the user is part of the chat, otherwise false.
   */
  async isUserInChat({
    userId,
    chatId,
  }: {
    userId: User["id"];
    chatId: Chat["id"];
  }): Promise<boolean> {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      select: {
        type: true,
        users: {
          where: {
            userId,
          },
        },
      },
    });

    if (!chat) return false;

    if (chat.type === "POST") return true;

    return chat.users.length !== 0;
  }

  /**
   * Creates a new message in a chat.
   * @param content - The content of the message.
   * @param authorId - The ID of the user creating the message.
   * @param chatId - The ID of the chat to send the message to.
   * @param files - A list of file URLs to associate with the message.
   * @param responseId - Optionally, the ID of the message being replied to.
   * @returns The created message object.
   */
  async createMessage({
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
    const result = await this.prisma.message.create({
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

    await this.prisma.chat.update({
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

    return Message.parse(message);
  }

  /**
   * Retrieves all chats for a user.
   * @param userId - The ID of the user to retrieve chats for.
   * @returns A list of chats the user is part of.
   */
  async getUserChats(userId: User["id"]): Promise<Chat[]> {
    const result = await this.prisma.chat.findMany({
      where: {
        users: {
          some: {
            userId,
          },
        },
      },
      include: {
        users: {
          include: {
            user: { select: userSelect },
          },
        },
        lastMessage: {
          select: messageWithoutResponseSelect,
        },
      },
    });

    return result.map((c) => Chat.parse(sanitizeChat(c)));
  }

  /**
   * Retrieves a private chat between two users by their IDs.
   * @param id1 - The ID of the first user.
   * @param id2 - The ID of the second user.
   * @returns The private chat object, or null if not found.
   */
  async getPrivateChatByUserIds(
    id1: string,
    id2: string
  ): Promise<Chat | null> {
    const result = await this.prisma.chat.findMany({
      where: {
        type: "PRIVATE",
        users: {
          every: {
            userId: {
              in: [id1, id2],
            },
          },
        },
      },
      include: {
        users: {
          include: {
            user: { select: userSelect },
          },
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

    if (!chat) return null;

    return Chat.parse(sanitizeChat(chat));
  }

  /**
   * Creates a new private chat between two users.
   * @param id1 The ID of the first user.
   * @param id2 The ID of the second user.
   * @returns The created private chat with user details and the last message, sanitized.
   */
  async createPrivateChat(id1: string, id2: string): Promise<Chat> {
    const users = Array.from(new Set([id1, id2]));

    const result = await this.prisma.chat.create({
      data: {
        type: "PRIVATE",
        users: {
          create: users.map((user) => ({
            user: {
              connect: { id: user },
            },
          })),
        },
      },
      include: {
        users: {
          include: {
            user: { select: userSelect },
          },
        },
        lastMessage: {
          select: messageWithoutResponseSelect,
        },
      },
    });

    return Chat.parse(sanitizeChat(result));
  }

  /**
   * Creates a new group chat with multiple users.
   * @param users The array of user IDs to be added to the group chat.
   * @param name The name of the group chat.
   * @param photoURL The photo URL for the group chat.
   * @returns The created group chat with user details and the last message, sanitized.
   */
  async createGroupChat(
    users: User["id"][],
    name: Chat["name"],
    photoURL: Chat["photoURL"]
  ): Promise<Chat> {
    users = Array.from(new Set(users));

    const result = await this.prisma.chat.create({
      data: {
        type: "GROUP",
        name,
        photoURL,
        users: {
          create: users.map((user) => ({
            user: {
              connect: { id: user },
            },
          })),
        },
      },
      include: {
        users: {
          include: {
            user: { select: userSelect },
          },
        },
        lastMessage: {
          select: messageWithoutResponseSelect,
        },
      },
    });

    return Chat.parse(sanitizeChat(result));
  }
}
