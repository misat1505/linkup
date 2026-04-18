import z from "zod";
import { File } from "./file";
import { Reaction } from "./reaction";
import { User } from "./user";

const ReponseSchema = z.object({
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
  response: ReponseSchema.nullable(),
  chatId: z.string(),
  files: z.array(File),
  reactions: z.array(Reaction),
});

export type Message = z.infer<typeof Message>;
