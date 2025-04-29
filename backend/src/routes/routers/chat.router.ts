import { Router } from "express";
import { validate } from "../../middlewares/validate";
import { upload } from "../../middlewares/multer";
import { ChatControllers } from "../../controllers";
import {
  ChatId,
  CreateMessageDTO,
  CreateReactionDTO,
  GetMessagesQuery,
} from "../../validators/chats/messages.validators";
import { UserId } from "../../validators/shared.validators";
import {
  CreateGroupChatDTO,
  CreatePrivateChatDTO,
  UpdateAliasDTO,
  UpdateGroupChatDTO,
} from "../../validators/chats/chats.validatotors";

/**
 * Chat Routes Router.
 *
 * This router handles all chat-related operations including creating private and group chats,
 * sending messages, adding reactions, updating user aliases, and managing group chat users.
 * All routes are protected and require authorization, with file uploads supported for certain endpoints.
 */
const chatRouter = Router();

chatRouter.post(
  "/private",
  validate({ body: CreatePrivateChatDTO }),
  ChatControllers.createPrivateChat
);

chatRouter.post(
  "/group",
  upload.single("file"),
  validate({ body: CreateGroupChatDTO }),
  ChatControllers.createGroupChat
);

chatRouter.get("/", ChatControllers.getSelfChats);

chatRouter.post(
  "/:chatId/messages",
  upload.array("files"),
  validate({ body: CreateMessageDTO, params: ChatId }),
  ChatControllers.createMessage
);

chatRouter.get(
  "/:chatId/messages",
  validate({ params: ChatId, query: GetMessagesQuery }),
  ChatControllers.getChatMessages
);

chatRouter.post(
  "/:chatId/reactions",
  validate({ body: CreateReactionDTO, params: ChatId }),
  ChatControllers.createReaction
);

chatRouter.put(
  "/:chatId/users/:userId/alias",
  validate({ body: UpdateAliasDTO, params: ChatId.merge(UserId) }),
  ChatControllers.updateAlias
);

chatRouter.post(
  "/:chatId/users",
  validate({ body: UserId, params: ChatId }),
  ChatControllers.addUserToGroupChat
);

chatRouter.delete(
  "/:chatId/users",
  validate({ params: ChatId }),
  ChatControllers.deleteSelfFromGroupChat
);

chatRouter.put(
  "/:chatId",
  upload.single("file"),
  validate({ body: UpdateGroupChatDTO, params: ChatId }),
  ChatControllers.updateGroupChat
);

export default chatRouter;
