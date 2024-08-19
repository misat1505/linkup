import { Router } from "express";
import {
  createMessage,
  createPrivateChat,
  getChatMessages,
  getUserChats,
} from "../../controllers/chat.controller";
import { validate } from "../../middlewares/validate";
import { createPrivateChatRules } from "../../validators/chat.validators";
import { upload } from "../../middlewares/multer";
import { authorize } from "../../middlewares/authorize";

const chatRouter = Router();

chatRouter.post(
  "/private",
  validate(createPrivateChatRules),
  createPrivateChat
);
chatRouter.get("/", getUserChats);
chatRouter.post(
  "/:chatId/messages",
  upload.array("files"),
  authorize, // multer is overriding req.body
  createMessage
);
chatRouter.get("/:chatId/messages", getChatMessages);

export default chatRouter;
