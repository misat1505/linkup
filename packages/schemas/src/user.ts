import z from "zod";
import { SCHEMA_REGISTRY } from "./registry";

export const User = z
  .object({
    id: z.uuid().openapi({
      description: "Unique identifier of the user",
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    firstName: z.string().min(1).max(50).openapi({
      description: "User's first name",
      example: "John",
    }),
    lastName: z.string().min(1).max(50).openapi({
      description: "User's last name",
      example: "Doe",
    }),
    photoURL: z.string().nullable().openapi({
      description: "URL of the user's profile picture",
      example: "https://example.com/avatar.png",
    }),
    lastActive: z.coerce.date().openapi({
      description: "Last time the user was active",
      example: "2024-01-01T12:00:00.000Z",
    }),
  })
  .openapi(SCHEMA_REGISTRY.USER);

export type User = z.infer<typeof User>;
