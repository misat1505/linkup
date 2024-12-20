import { Router } from "express";
import { authorize } from "../middlewares/authorize";
import authRouterProtected from "./routers/auth.router";
import { updateLastActive } from "../middlewares/updateLastActive";
import userRouter from "./routers/user.router";
import chatRouter from "./routers/chat.router";
import fileRouter from "./routers/file.router";
import postRouter from "./routers/post.router";
import friendshipRouter from "./routers/friendship.router";

const protectedRoutes = Router();

protectedRoutes.use(authorize);
protectedRoutes.use(updateLastActive);

protectedRoutes.use("/auth", authRouterProtected);
protectedRoutes.use("/files", fileRouter);
protectedRoutes.use("/users", userRouter);
protectedRoutes.use("/chats", chatRouter);
protectedRoutes.use("/posts", postRouter);
protectedRoutes.use("/friendships", friendshipRouter);

export default protectedRoutes;
