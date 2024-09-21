import { Request, Response } from "express";
import { ChatService } from "../services/ChatService";
import { processAvatar } from "../utils/processAvatar";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export const updateGroupChat = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /chats/{chatId}:
   *   put:
   *     summary: Update a group chat
   *     tags: [Chats]
   *     parameters:
   *       - name: chatId
   *         in: path
   *         required: true
   *         description: The ID of the chat to update.
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *             required:
   *               - name
   *     responses:
   *       201:
   *         description: Chat updated successfully
   *       401:
   *         description: User not authorized to update this chat
   *       400:
   *         description: Cannot update chat of this type
   *       500:
   *         description: Server error when updating chat
   */
  try {
    const {
      name,
      token: { userId },
    } = req.body;
    const { chatId } = req.params;

    const isAuthorized = await ChatService.isUserInChat({ chatId, userId });
    if (!isAuthorized)
      return res
        .status(401)
        .json({ message: "Cannot update chat you do not belong to." });

    const oldChat = await ChatService.getChatById(chatId);
    if (!oldChat || oldChat.type !== "GROUP")
      return res
        .status(400)
        .json({ message: "cannot update chat of this type." });

    const newFilename = uuidv4();
    const file = await processAvatar(
      req.file?.path,
      ["chats", chatId],
      newFilename + ".webp"
    );

    if (oldChat.photoURL) {
      const oldFilePath = path.join(
        __dirname,
        "..",
        "..",
        "files",
        "chats",
        chatId,
        oldChat.photoURL
      );
      if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
    }

    const chat = await ChatService.updateGroupChat({ chatId, file, name });

    return res.status(201).json({ chat });
  } catch (e) {
    return res.status(500).json({ message: "Cannot create group chat." });
  }
};

export const deleteUserFromGroupChat = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /chats/{chatId}/users:
   *   delete:
   *     summary: Remove a user from a group chat
   *     tags: [Chats]
   *     parameters:
   *       - name: chatId
   *         in: path
   *         required: true
   *         description: The ID of the chat from which to remove the user.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Successfully deleted from chat
   *       401:
   *         description: User not authorized to remove from this chat
   *       500:
   *         description: Server error when removing user from chat
   */
  try {
    const { chatId } = req.params;
    const {
      token: { userId },
    } = req.body;

    const chatType = await ChatService.getChatType(chatId);
    if (chatType !== "GROUP")
      return res
        .status(401)
        .json({ message: "Cannot remove yourself from chat of this type." });

    const iAmInChat = await ChatService.isUserInChat({ userId, chatId });
    if (!iAmInChat)
      return res.status(401).json({
        message: "Cannot remove yourself from chat which you do not belong to.",
      });

    await ChatService.deleteFromChat({ chatId, userId });
    return res.status(200).json({ message: "Successfully deleted from chat." });
  } catch (e) {
    return res.status(500).json({ message: "Cannot add user to this chat." });
  }
};

export const addUserToGroupChat = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /chats/{chatId}/users:
   *   post:
   *     summary: Add a user to a group chat
   *     tags: [Chats]
   *     parameters:
   *       - name: chatId
   *         in: path
   *         required: true
   *         description: The ID of the chat to which to add the user.
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               userId:
   *                 type: string
   *             required:
   *               - userId
   *     responses:
   *       201:
   *         description: User added to chat successfully
   *       401:
   *         description: User not authorized to add to this chat
   *       409:
   *         description: User is already in this chat
   *       500:
   *         description: Server error when adding user to chat
   */
  try {
    const { chatId } = req.params;
    const {
      token: { userId: myId },
      userId,
    } = req.body;

    const chatType = await ChatService.getChatType(chatId);
    if (chatType !== "GROUP")
      return res
        .status(401)
        .json({ message: "Cannot add people to chat of this type." });

    const iAmInChat = await ChatService.isUserInChat({ userId: myId, chatId });
    if (!iAmInChat)
      return res.status(401).json({
        message: "Cannot add users to chat to which you do not belong to.",
      });

    const isOtherInChat = await ChatService.isUserInChat({ userId, chatId });
    if (isOtherInChat)
      return res.status(409).json({ message: "User is already in this chat." });

    const user = await ChatService.addUserToChat({ chatId, userId });
    return res.status(201).json({ user });
  } catch (e) {
    return res.status(500).json({ message: "Cannot add user to this chat." });
  }
};

export const updateAlias = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /chats/{chatId}/alias/{userId}:
   *   put:
   *     summary: Update a user's alias in a group chat
   *     tags: [Chats]
   *     parameters:
   *       - name: chatId
   *         in: path
   *         required: true
   *         description: The ID of the chat where the alias will be updated.
   *         schema:
   *           type: string
   *       - name: userId
   *         in: path
   *         required: true
   *         description: The ID of the user whose alias will be updated.
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               alias:
   *                 type: string
   *             required:
   *               - alias
   *     responses:
   *       200:
   *         description: Alias updated successfully
   *       401:
   *         description: User not authorized to update alias
   *       500:
   *         description: Server error when updating alias
   */
  try {
    const {
      token: { userId },
      alias,
    } = req.body;
    const { chatId, userId: userToUpdateId } = req.params;

    const isUserUpdatedInChat = await ChatService.isUserInChat({
      userId: userToUpdateId,
      chatId,
    });
    if (!isUserUpdatedInChat)
      return res
        .status(401)
        .json({ message: "This user doesn't belong to this chat." });

    const isAuthorized = await ChatService.isUserInChat({ userId, chatId });
    if (!isAuthorized)
      return res
        .status(401)
        .json({ message: "Cannot set aliases in chat you do not belong to." });

    await ChatService.updateAlias({ userId: userToUpdateId, chatId, alias });

    return res.status(200).json({ alias });
  } catch (e) {
    return res.status(500).json({ message: "Cannot update alias." });
  }
};

export const createReaction = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /chats/{chatId}/reactions:
   *   post:
   *     summary: Create a reaction to a message in a chat
   *     tags: [Chats]
   *     parameters:
   *       - name: chatId
   *         in: path
   *         required: true
   *         description: The ID of the chat where the message exists.
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               reactionId:
   *                 type: string
   *               messageId:
   *                 type: string
   *             required:
   *               - reactionId
   *               - messageId
   *     responses:
   *       201:
   *         description: Reaction created successfully
   *       401:
   *         description: User not authorized to create reaction
   *       500:
   *         description: Server error when creating reaction
   */
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
  /**
   * @swagger
   * /chats/{chatId}/messages:
   *   get:
   *     summary: Get messages from a chat
   *     tags: [Chats]
   *     parameters:
   *       - name: chatId
   *         in: path
   *         required: true
   *         description: The ID of the chat from which to retrieve messages.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Messages retrieved successfully
   *       401:
   *         description: User not authorized to read messages from this chat
   *       500:
   *         description: Server error when fetching messages
   */
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
  /**
   * @swagger
   * /chats/{chatId}/messages:
   *   post:
   *     summary: Create a new message in a chat
   *     tags: [Chats]
   *     parameters:
   *       - name: chatId
   *         in: path
   *         required: true
   *         description: The ID of the chat where the message will be sent.
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               content:
   *                 type: string
   *               responseId:
   *                 type: string
   *             required:
   *               - content
   *     responses:
   *       201:
   *         description: Message created successfully
   *       401:
   *         description: User not authorized to send a message
   *       400:
   *         description: Response message does not exist in this chat
   *       500:
   *         description: Server error when creating message
   */
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

    files.forEach((file) => {
      const commonPath = path.join(__dirname, "..", "..", "files");
      const inPath = path.join(commonPath, "temp", file);
      const outPath = path.join(commonPath, "chats", chatId, file);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.copyFileSync(inPath, outPath);
      fs.unlinkSync(inPath);
    });

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
  /**
   * @swagger
   * /chats:
   *   get:
   *     summary: Get all chats for a user
   *     tags: [Chats]
   *     responses:
   *       200:
   *         description: Chats retrieved successfully
   *       500:
   *         description: Server error when fetching user's chats
   */
  try {
    const { userId } = req.body.token;

    const chats = await ChatService.getUserChats(userId);

    return res.status(200).json({ chats });
  } catch (e) {
    return res.status(500).json({ message: "Cannot get user's chats." });
  }
};

export const createGroupChat = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /chats/group:
   *   post:
   *     summary: Create a new group chat
   *     tags: [Chats]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               users:
   *                 type: array
   *                 items:
   *                   type: string
   *               name:
   *                 type: string
   *             required:
   *               - users
   *               - name
   *     responses:
   *       201:
   *         description: Group chat created successfully
   *       401:
   *         description: User not authorized to create group chat
   *       500:
   *         description: Server error when creating group chat
   */
  try {
    const {
      users,
      name,
      token: { userId },
    } = req.body;
    if (!users.includes(userId))
      return res
        .status(401)
        .json({ message: "Cannot create group chat not belonging to you." });

    const originalPath = req.file?.path || null;
    const newFilename = originalPath ? uuidv4() + ".webp" : null;
    const chat = await ChatService.createGroupChat(users, name, newFilename);

    if (newFilename)
      await processAvatar(req.file?.path, ["chats", chat.id], newFilename);

    return res.status(201).json({ chat });
  } catch (e) {
    return res.status(500).json({ message: "Cannot create group chat." });
  }
};

export const createPrivateChat = async (req: Request, res: Response) => {
  /**
   * @swagger
   * /chats/private:
   *   post:
   *     summary: Create a new private chat
   *     tags: [Chats]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               users:
   *                 type: array
   *                 items:
   *                   type: string
   *             required:
   *               - users
   *     responses:
   *       201:
   *         description: Private chat created successfully
   *       409:
   *         description: Chat already exists
   *       401:
   *         description: User not authorized to create private chat
   *       500:
   *         description: Server error when creating private chat
   */
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
