import { z } from "zod";
import { Post } from "../types/Post";

export const PostId = Post.pick({ id: true }).strict();
export type PostId = z.infer<typeof PostId>;

export const UserId = z.object({ userId: z.string().uuid() }).strict();
export type UserId = z.infer<typeof UserId>;
