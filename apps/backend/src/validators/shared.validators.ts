import { Post } from "@packages/schemas";
import { z } from "zod";

export const PostId = Post.pick({ id: true }).strict();
export type PostId = z.infer<typeof PostId>;

export const UserId = z.object({ userId: z.string().uuid() }).strict();
export type UserId = z.infer<typeof UserId>;
