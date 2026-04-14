import authRouter from "./auth.public.router";
import authRouterProtected from "./auth.router";
import chatRouter from "./chat.router";
import fileRouter from "./file.router";
import friendshipRouter from "./friendship.router";
import postRouter from "./post.router";
import userRouter from "./user.router";

export const Routers = {
  auth: { public: authRouter, protected: authRouterProtected },
  chat: chatRouter,
  file: fileRouter,
  friendship: friendshipRouter,
  post: postRouter,
  user: userRouter,
};
