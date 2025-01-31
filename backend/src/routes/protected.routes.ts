import { Router } from "express";
import { authorize } from "../middlewares/authorize";
import authRouterProtected from "./routers/auth.router";
import { updateLastActive } from "../middlewares/updateLastActive";
import userRouter from "./routers/user.router";
import chatRouter from "./routers/chat.router";
import fileRouter from "./routers/file.router";
import postRouter from "./routers/post.router";
import friendshipRouter from "./routers/friendship.router";

/**
 * Protected Routes Router.
 *
 * This router contains routes that require authorization and updates the user's last active time.
 * All requests to these routes will first go through the `authorize` and `updateLastActive` middlewares.
 */
const protectedRoutes = Router();

protectedRoutes.use("/auth", authorize, updateLastActive, authRouterProtected);
protectedRoutes.use("/files", authorize, updateLastActive, fileRouter);
protectedRoutes.use("/users", authorize, updateLastActive, userRouter);
protectedRoutes.use("/chats", authorize, updateLastActive, chatRouter);
protectedRoutes.use("/posts", authorize, updateLastActive, postRouter);
protectedRoutes.use(
  "/friendships",
  authorize,
  updateLastActive,
  friendshipRouter
);

export default protectedRoutes;
