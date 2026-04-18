import z from "zod";
import { Message } from "./message";
import { User } from "./user";

export const UserInChat = User.extend({
  alias: z.string().nullable(),
});

export const Chat = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  name: z.string().nullable(),
  photoURL: z.string().nullable(),
  type: z.enum(["PRIVATE", "GROUP", "POST"]),
  users: z.array(UserInChat).nullable(),
  lastMessage: Message.omit({ response: true, reactions: true }).nullable(),
});

export type Chat = z.infer<typeof Chat>;
export type UserInChat = z.infer<typeof UserInChat>;
