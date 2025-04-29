import { z } from "zod";

const uuidOrNull = z
  .string()
  .refine((val) => val === "null" || z.string().uuid().safeParse(val).success, {
    message: "Must be a UUID or 'null'",
  })
  .transform((val) => (val === "null" ? null : val));

const limit = z.union([z.string(), z.number()]).transform((val) => {
  const num = typeof val === "string" ? parseInt(val, 10) : val;
  if (isNaN(num)) throw new Error("Limit must be a valid number");
  return num;
});

export const GetMessagesQuery = z.union([
  z
    .object({
      responseId: uuidOrNull,
    })
    .strict(),
  z
    .object({
      lastMessageId: uuidOrNull,
      limit,
    })
    .strict(),
]);
export type GetMessagesQuery = z.infer<typeof GetMessagesQuery>;

export const ChatId = z
  .object({
    chatId: z.string().uuid(),
  })
  .strict();
export type ChatId = z.infer<typeof ChatId>;

export const CreateMessageDTO = z
  .object({
    content: z.string().max(5000),
    responseId: z.string().uuid().optional(),
  })
  .strict();
export type CreateMessageDTO = z.infer<typeof CreateMessageDTO>;

export const CreateReactionDTO = z
  .object({
    messageId: z.string().uuid(),
    reactionId: z.string().uuid(),
  })
  .strict();
export type CreateReactionDTO = z.infer<typeof CreateReactionDTO>;
