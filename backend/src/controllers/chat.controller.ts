import { Request, Response } from "express";
import { ChatService } from "../services/ChatService";

export const createPrivateChat = async (req: Request, res: Response) => {
  try {
    const { users } = req.body;

    const chat = await ChatService.getPrivateChatByUserIds(users[0], users[1]);
    console.log(chat);

    if (chat) return res.status(409).json({ chat });

    const createdChat = await ChatService.createPrivateChat(users[0], users[1]);

    return res.status(200).json({ chat: createdChat });
  } catch (e) {
    return res.status(500).json({ message: "Cannot create private chat." });
  }
};
