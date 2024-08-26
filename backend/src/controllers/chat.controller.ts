import { Request, Response } from "express";
import { ChatService } from "../services/ChatService";
import { processAvatar } from "../utils/processAvatar";

export const createReaction = async (req: Request, res: Response) => {
  try {
    const {
      token: { userId },
      reactionId,
      messageId,
    } = req.body;
    const { chatId } = req.params;

    const isUserAuthorized = await ChatService.isUserInChat({ chatId, userId });

    if (!isUserAuthorized)
      return res.status(401).json({
        message: "You cannot create reaction in chat not belonging to you.",
      });

    const isMessageInChat = await ChatService.isMessageInChat({
      chatId,
      messageId,
    });

    if (!isMessageInChat)
      return res.status(401).json({
        message:
          "Cannot create reaction to a message that is not in given chat.",
      });

    const reaction = await ChatService.createReactionToMessage({
      userId,
      reactionId,
      messageId,
    });

    return res.status(201).json({ reaction });
  } catch (e) {
    return res.status(500).json({ message: "Cannot create reaction." });
  }
};

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body.token;
    const { chatId } = req.params;

    const isUserAuthorized = await ChatService.isUserInChat({ chatId, userId });

    if (!isUserAuthorized)
      return res
        .status(401)
        .json({ message: "You cannot read messages from this chat." });

    const messages = await ChatService.getChatMessages(chatId);

    return res.status(200).json({ messages });
  } catch (e) {
    return res.status(500).json({ message: "Cannot get messages." });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const { content, responseId } = req.body;
    const { userId } = req.body.token;
    const { chatId } = req.params;
    const files = (req.files as Express.Multer.File[]).map(
      (file) => file.filename
    );

    const isUserAuthorized = await ChatService.isUserInChat({ chatId, userId });

    if (!isUserAuthorized)
      return res
        .status(401)
        .json({ message: "You cannot send a message to this chat." });

    if (responseId) {
      const isResponseInChat = await ChatService.isMessageInChat({
        chatId,
        messageId: responseId,
      });

      if (!isResponseInChat)
        return res.status(400).json({
          message: "Message of responseId does not exist on this chat.",
        });
    }

    const message = await ChatService.createMessage({
      content,
      authorId: userId,
      chatId,
      files,
      responseId,
    });

    return res.status(201).json({ message });
  } catch (e) {
    return res.status(500).json({ message: "Cannot create message." });
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body.token;

    const chats = await ChatService.getUserChats(userId);

    return res.status(200).json({ chats });
  } catch (e) {
    return res.status(500).json({ message: "Cannot get user's chats." });
  }
};

export const createGroupChat = async (req: Request, res: Response) => {
  try {
    const {
      users,
      name,
      token: { userId },
    } = req.body;
    const file = await processAvatar(req.file?.path);

    if (!users.includes(userId))
      return res
        .status(401)
        .json({ message: "Cannot create group chat not belonging to you." });

    const chat = await ChatService.createGroupChat(users, name, file);

    return res.status(201).json({ chat });
  } catch (e) {
    return res.status(500).json({ message: "Cannot create group chat." });
  }
};

export const createPrivateChat = async (req: Request, res: Response) => {
  try {
    const {
      users,
      token: { userId },
    } = req.body;

    if (!users.includes(userId))
      return res
        .status(401)
        .json({ message: "Cannot create private chat not belonging to you." });

    const chat = await ChatService.getPrivateChatByUserIds(users[0], users[1]);

    if (chat) return res.status(409).json({ chat });

    const createdChat = await ChatService.createPrivateChat(users[0], users[1]);

    return res.status(201).json({ chat: createdChat });
  } catch (e) {
    return res.status(500).json({ message: "Cannot create private chat." });
  }
};
