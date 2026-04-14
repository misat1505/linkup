import { z } from "zod";

export const FileQuery = z.discriminatedUnion("filter", [
  z
    .object({
      filter: z.literal("avatar"),
    })
    .strict(),
  z
    .object({
      filter: z.literal("chat-message"),
      chat: z.string().uuid(),
    })
    .strict(),
  z
    .object({
      filter: z.literal("chat-photo"),
      chat: z.string().uuid(),
    })
    .strict(),
  z
    .object({
      filter: z.literal("cache"),
    })
    .strict(),
  z
    .object({
      filter: z.literal("post"),
      post: z.string().uuid(),
    })
    .strict(),
]);
export type FileQuery = z.infer<typeof FileQuery>;

export const Filename = z.object({ filename: z.string() }).strict();
export type Filename = z.infer<typeof Filename>;
