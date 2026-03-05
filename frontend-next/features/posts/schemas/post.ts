import { User } from "@/features/auth/schemas/user";
import z from "zod";

const Chat = z.object({});

// TODO: use proper Chat
export const Post = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.coerce.date(),
  chat: Chat,
  author: User,
});

export type Post = z.infer<typeof Post>;

export const PostWithRenderedContent = Post.extend({
  renderedContent: z.string(),
});

export type PostWithRenderedContent = z.infer<typeof PostWithRenderedContent>;
