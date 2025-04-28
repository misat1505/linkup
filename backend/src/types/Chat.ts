import { z } from "zod";
import { User } from "./User";
import { Message } from "./Message";

const UserInChat = User.extend({
  alias: z.string().nullable(),
});

export const Chat = z.object({
  id: z.string().uuid(),
  createdAt: z
    .union([z.string(), z.date()])
    .transform((value) =>
      typeof value === "string" ? new Date(value) : value
    ),
  name: z.string().nullable(),
  photoURL: z.string().nullable(),
  type: z.enum(["PRIVATE", "GROUP", "POST"]),
  users: z.array(UserInChat).nullable(),
  lastMessage: Message.omit({ response: true, reactions: true }).nullable(),
});

export type Chat = z.infer<typeof Chat>;
export type UserInChat = z.infer<typeof UserInChat>;
