import { Router } from "express";
import { authorize } from "../middlewares/authorize";
import { updateLastActive } from "../middlewares/updateLastActive";
import { Routers } from "./routers";

/**
 * Protected Routes Router.
 *
 * This router contains routes that require authorization and updates the user's last active time.
 * All requests to these routes will first go through the `authorize` and `updateLastActive` middlewares.
 */
const protectedRoutes = Router();

protectedRoutes.use(
  "/auth",
  authorize,
  updateLastActive,
  Routers.auth.protected
);
protectedRoutes.use("/files", authorize, updateLastActive, Routers.file);
protectedRoutes.use("/users", authorize, updateLastActive, Routers.user);
protectedRoutes.use("/chats", authorize, updateLastActive, Routers.chat);
protectedRoutes.use("/posts", authorize, updateLastActive, Routers.post);
protectedRoutes.use(
  "/friendships",
  authorize,
  updateLastActive,
  Routers.friendship
);

export default protectedRoutes;
