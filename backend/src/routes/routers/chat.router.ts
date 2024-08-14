import { Router } from "express";
import { createPrivateChat } from "../../controllers/chat.controller";

const chatRouter = Router();

chatRouter.post("/private", createPrivateChat);

export default chatRouter;
