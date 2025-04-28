import authRouter from "./auth.public.router";
import authRouterProtected from "./auth.router";
import chatRouter from "./chat.router";
import fileRouter from "./file.router";
import friendshipRouter from "./friendship.router";
import postRouter from "./post.router";
import userRouter from "./user.router";

export namespace Routers {
  export const auth = { public: authRouter, protected: authRouterProtected };
  export const chat = chatRouter;
  export const file = fileRouter;
  export const friendship = friendshipRouter;
  export const post = postRouter;
  export const user = userRouter;
}
