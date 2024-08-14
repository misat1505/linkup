import { Router } from "express";
import {
  createMessage,
  createPrivateChat,
  getChatMessages,
  getUserChats,
} from "../../controllers/chat.controller";
import { validate } from "../../middlewares/validate";
import { createPrivateChatRules } from "../../validators/chat.validators";

const chatRouter = Router();

chatRouter.post(
  "/private",
  validate(createPrivateChatRules),
  createPrivateChat
);
chatRouter.get("/", getUserChats);
chatRouter.post("/:chatId/messages", createMessage);
chatRouter.get("/:chatId/messages", getChatMessages);

export default chatRouter;
