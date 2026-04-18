import z from "zod";
import { Chat } from "./chat";
import { User } from "./user";

const PostChat = Chat.pick({ id: true, createdAt: true, type: true });

export const Post = z.object({
  id: z.string().uuid(),
  content: z.string(),
  createdAt: z.coerce.date(),
  chat: PostChat.strict(),
  author: User.strict(),
});

export type Post = z.infer<typeof Post>;
