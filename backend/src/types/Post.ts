import { Chat } from "./Chat";
import { User } from "./User";
import { z } from "zod";

const PostChat = Chat.pick({ id: true, createdAt: true, type: true });

export const Post = z.object({
  id: z.string().uuid(),
  content: z.string(),
  createdAt: z
    .union([z.string(), z.date()])
    .transform((value) =>
      typeof value === "string" ? new Date(value) : value
    ),
  chat: PostChat.strict(),
  author: User.strict(),
});

export type Post = z.infer<typeof Post>;
