import { Router } from "express";
import { validate } from "../../middlewares/validate";
import {
  addUserToGroupChatRules,
  createGroupChatRules,
  createMessageRules,
  createPrivateChatRules,
  createReactionRules,
  updateAliasRules,
  updateGroupChatRules,
} from "../../validators/chat.validators";
import { upload } from "../../middlewares/multer";
import { authorize } from "../../middlewares/authorize";
import { ChatControllers } from "../../controllers";

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
  validate(createPrivateChatRules),
  ChatControllers.createPrivateChat
);

chatRouter.post(
  "/group",
  upload.single("file"),
  validate(createGroupChatRules),
  authorize,
  ChatControllers.createGroupChat
);

chatRouter.get("/", ChatControllers.getSelfChats);

chatRouter.post(
  "/:chatId/messages",
  upload.array("files"),
  validate(createMessageRules),
  authorize, // multer is overriding req.body
  ChatControllers.createMessage
);

chatRouter.get("/:chatId/messages", ChatControllers.getChatMessages);

chatRouter.post(
  "/:chatId/reactions",
  validate(createReactionRules),
  ChatControllers.createReaction
);

chatRouter.put(
  "/:chatId/users/:userId/alias",
  validate(updateAliasRules),
  ChatControllers.updateAlias
);

chatRouter.post(
  "/:chatId/users",
  validate(addUserToGroupChatRules),
  ChatControllers.addUserToGroupChat
);

chatRouter.delete("/:chatId/users", ChatControllers.deleteSelfFromGroupChat);

chatRouter.put(
  "/:chatId",
  upload.single("file"),
  validate(updateGroupChatRules),
  authorize,
  ChatControllers.updateGroupChat
);

export default chatRouter;
