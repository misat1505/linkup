import { Request, Response } from "express";
import { ChatService } from "../services/ChatService";

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
    const { content } = req.body;
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

    const message = await ChatService.createMessage({
      content,
      authorId: userId,
      chatId,
      files,
    });

    return res.status(201).json({ message });
  } catch (e) {
    console.log(e);
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
