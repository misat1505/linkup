import { User } from "@/features/auth/schemas/user";
import z from "zod";
import { Message } from "./message";

export const UserInChat = User.extend({
  alias: z.string().nullable(),
});

export type UserInChat = z.infer<typeof UserInChat>;

export const Chat = z.object({
  id: z.string(),
  createdAt: z.coerce.date(),
  name: z.string().nullable(),
  photoURL: z.string().nullable(),
  type: z.enum(["PRIVATE", "GROUP", "POST"]),
  users: z.array(UserInChat).nullable(),
  lastMessage: Message.omit({ response: true, reactions: true }).nullable(),
});

export type Chat = z.infer<typeof Chat>;
