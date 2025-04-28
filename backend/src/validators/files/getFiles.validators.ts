import { z } from "zod";

export const FileQuery = z.discriminatedUnion("filter", [
  z.object({
    filter: z.literal("avatar"),
  }),
  z.object({
    filter: z.literal("chat-message"),
    chat: z.string().uuid(),
  }),
  z.object({
    filter: z.literal("chat-photo"),
    chat: z.string().uuid(),
  }),
  z.object({
    filter: z.literal("cache"),
  }),
  z.object({
    filter: z.literal("post"),
    post: z.string().uuid(),
  }),
]);

export type FileQuery = z.infer<typeof FileQuery>;

export const Filename = z.object({ filename: z.string() });

export type Filename = z.infer<typeof Filename>;
