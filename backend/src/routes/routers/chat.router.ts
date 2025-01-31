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
import { createPrivateChatController } from "../../controllers/chat/createPrivateChat.controller";
import { createGroupChatController } from "../../controllers/chat/createGroupChat.controller";
import { getSelfChatsController } from "../../controllers/chat/getSelfChats.controller";
import { createMessageController } from "../../controllers/chat/createMessage.controller";
import { getChatMessagesController } from "../../controllers/chat/getChatMessages.controller";
import { createReactionController } from "../../controllers/chat/createReaction.controller";
import { updateAliasController } from "../../controllers/chat/updateUserAlias.controller";
import { addUserToGroupChatController } from "../../controllers/chat/addUserToGroupChat.controller";
import { deleteSelfFromGroupChatController } from "../../controllers/chat/deleteSelfFromGroupChat.controller";
import { updateGroupChatController } from "../../controllers/chat/updateGroupChat.controller";

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
  createPrivateChatController
);

chatRouter.post(
  "/group",
  upload.single("file"),
  validate(createGroupChatRules),
  authorize,
  createGroupChatController
);

chatRouter.get("/", getSelfChatsController);

chatRouter.post(
  "/:chatId/messages",
  upload.array("files"),
  validate(createMessageRules),
  authorize, // multer is overriding req.body
  createMessageController
);

chatRouter.get("/:chatId/messages", getChatMessagesController);

chatRouter.post(
  "/:chatId/reactions",
  validate(createReactionRules),
  createReactionController
);

chatRouter.put(
  "/:chatId/users/:userId/alias",
  validate(updateAliasRules),
  updateAliasController
);

chatRouter.post(
  "/:chatId/users",
  validate(addUserToGroupChatRules),
  addUserToGroupChatController
);

chatRouter.delete("/:chatId/users", deleteSelfFromGroupChatController);

chatRouter.put(
  "/:chatId",
  upload.single("file"),
  validate(updateGroupChatRules),
  authorize,
  updateGroupChatController
);

export default chatRouter;
