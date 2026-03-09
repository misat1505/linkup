import z from "zod";
import { Reaction } from "./reaction";
import { User } from "@/features/auth/schemas/user";
import { File } from "./file";

export const ResponseSchema = z.object({
  id: z.string(),
  content: z.string().nullable(),
  author: User,
  createdAt: z.coerce.date(),
  chatId: z.string(),
  files: z.array(File),
});

export const Message = z.object({
  id: z.string(),
  content: z.string().nullable(),
  author: User,
  createdAt: z.coerce.date(),
  response: ResponseSchema.nullable(),
  chatId: z.string(),
  files: z.array(File),
  reactions: z.array(Reaction),
});

export type Response = z.infer<typeof ResponseSchema>;
export type Message = z.infer<typeof Message>;
