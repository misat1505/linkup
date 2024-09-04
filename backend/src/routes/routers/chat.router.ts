import { Router } from "express";
import {
  addUserToGroupChat,
  createGroupChat,
  createMessage,
  createPrivateChat,
  createReaction,
  deleteUserFromGroupChat,
  getChatMessages,
  getUserChats,
  updateAlias,
  updateGroupChat,
} from "../../controllers/chat.controller";
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

const chatRouter = Router();

chatRouter.post(
  "/private",
  validate(createPrivateChatRules),
  createPrivateChat
);

chatRouter.post(
  "/group",
  upload.single("file"),
  validate(createGroupChatRules),
  authorize,
  createGroupChat
);

chatRouter.get("/", getUserChats);

chatRouter.post(
  "/:chatId/messages",
  upload.array("files"),
  validate(createMessageRules),
  authorize, // multer is overriding req.body
  createMessage
);

chatRouter.get("/:chatId/messages", getChatMessages);

chatRouter.post(
  "/:chatId/reactions",
  validate(createReactionRules),
  createReaction
);

chatRouter.put(
  "/:chatId/users/:userId/alias",
  validate(updateAliasRules),
  updateAlias
);

chatRouter.post(
  "/:chatId/users",
  validate(addUserToGroupChatRules),
  addUserToGroupChat
);

chatRouter.delete("/:chatId/users", deleteUserFromGroupChat);

chatRouter.put(
  "/:chatId",
  upload.single("file"),
  validate(updateGroupChatRules),
  authorize,
  updateGroupChat
);

export default chatRouter;
