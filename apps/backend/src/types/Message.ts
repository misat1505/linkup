import { File } from "./File";
import { Reaction } from "./Reaction";
import { User } from "./User";
import { z } from "zod";

const ReponseSchema = z.object({
  id: z.string(),
  content: z.string().nullable(),
  author: User,
  createdAt: z
    .union([z.string(), z.date()])
    .transform((value) =>
      typeof value === "string" ? new Date(value) : value
    ),
  chatId: z.string(),
  files: z.array(File),
});

export const Message = z.object({
  id: z.string(),
  content: z.string().nullable(),
  author: User,
  createdAt: z
    .union([z.string(), z.date()])
    .transform((value) =>
      typeof value === "string" ? new Date(value) : value
    ),
  response: ReponseSchema.nullable(),
  chatId: z.string(),
  files: z.array(File),
  reactions: z.array(Reaction),
});

export type Message = z.infer<typeof Message>;
