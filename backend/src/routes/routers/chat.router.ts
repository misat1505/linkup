import { Router } from "express";
import {
  createPrivateChat,
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

export default chatRouter;
