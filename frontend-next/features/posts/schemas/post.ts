import { User } from "@/features/auth/schemas/user";
import { Chat } from "@/features/chats/schemas/chat";
import z from "zod";

export const Post = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date(),
  chat: Chat.pick({ id: true, createdAt: true, type: true }),
  author: User,
});

export type Post = z.infer<typeof Post>;

export const PostWithRenderedContent = Post.extend({
  renderedContent: z.string(),
});

export type PostWithRenderedContent = z.infer<typeof PostWithRenderedContent>;
