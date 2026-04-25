import z from "zod";
import { File } from "./file";
import { Reaction } from "./reaction";
import { SCHEMA_REGISTRY } from "./registry";
import { User } from "./user";

const MessageId = z.union([z.uuid(), z.literal("null")]).openapi({
  description: "UUID of the message or string 'null'",
  example: "550e8400-e29b-41d4-a716-446655440000",
});

const MessageResponse = z
  .object({
    id: MessageId,
    content: z.string().nullable().openapi({
      description: "Content of the replied message",
      example: "Hello there!",
    }),
    author: User.openapi({
      description: "Author of the replied message",
    }),
    createdAt: z.coerce.date().openapi({
      example: "2024-01-01T12:00:00.000Z",
    }),
    chatId: z.string().openapi({
      example: "chat_123",
    }),
    files: z.array(File).openapi({
      description: "Files attached to the replied message",
    }),
  })
  .openapi(SCHEMA_REGISTRY.MESSAGE_RESPONSE);

export const Message = z
  .object({
    id: MessageId,
    content: z.string().nullable().openapi({
      description: "Message content",
      example: "Hi!",
    }),
    author: User.openapi({
      description: "Author of the message",
    }),
    createdAt: z.coerce.date().openapi({
      example: "2024-01-01T12:05:00.000Z",
    }),
    response: MessageResponse.nullable().openapi({
      description: "Message that this message is replying to",
    }),
    chatId: z.string().openapi({
      example: "chat_123",
    }),
    files: z.array(File).openapi({
      description: "Files attached to the message",
    }),
    reactions: z.array(Reaction).openapi({
      description: "Reactions to the message",
    }),
  })
  .openapi(SCHEMA_REGISTRY.MESSAGE);

export type Message = z.infer<typeof Message>;
