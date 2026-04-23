import { Router } from "express";
import { Routers } from "./routers";

/**
 * Protected Routes Router.
 *
 * This router contains routes that require authorization and updates the user's last active time.
 * All requests to these routes will first go through the `authorize` and `updateLastActive` middlewares.
 */
const routers = [
  Routers.auth.protected,
  Routers.file,
  Routers.user,
  Routers.chat,
  Routers.post,
  Routers.friendship,
];

const protectedRouter = Router();

routers.forEach((router) => {
  protectedRouter.use(router);
});

export default protectedRouter;
