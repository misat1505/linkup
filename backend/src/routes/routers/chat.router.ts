import { Router } from "express";
import {
  createGroupChat,
  createMessage,
  createPrivateChat,
  getChatMessages,
  getUserChats,
} from "../../controllers/chat.controller";
import { validate } from "../../middlewares/validate";
import {
  createGroupChatRules,
  createMessageRules,
  createPrivateChatRules,
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

export default chatRouter;
