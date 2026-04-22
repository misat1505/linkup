import z from "zod";
import { Message } from "./message";
import { SCHEMA_REGISTRY } from "./registry";
import { User } from "./user";

export const UserInChat = User.extend({
  alias: z.string().nullable().openapi({
    description: "Optional alias of the user in a chat",
    example: "john_doe",
  }),
}).openapi(SCHEMA_REGISTRY.USER_IN_CHAT);

export const Chat = z
  .object({
    id: z.uuid().openapi({
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    createdAt: z.coerce.date().openapi({
      example: "2024-01-01T12:00:00.000Z",
    }),
    name: z.string().nullable().openapi({
      description: "Chat name (for group chats)",
      example: "My group chat",
    }),
    photoURL: z.string().nullable().openapi({
      description: "URL of the chat photo",
      example: "https://example.com/photo.png",
    }),
    type: z.enum(["PRIVATE", "GROUP", "POST"]).openapi({
      description: "Type of the chat",
      example: "GROUP",
    }),
    users: z.array(UserInChat).nullable().openapi({
      description: "Users participating in the chat",
    }),
    lastMessage: Message.omit({ response: true, reactions: true })
      .nullable()
      .openapi({
        description: "Last message sent in the chat",
      }),
  })
  .openapi(SCHEMA_REGISTRY.CHAT);

export type Chat = z.infer<typeof Chat>;
export type UserInChat = z.infer<typeof UserInChat>;
