import z from "zod";
import { SCHEMA_REGISTRY } from "./registry";

export const File = z
  .object({
    id: z.uuid().openapi({
      description: "Unique identifier of the file",
      example: "550e8400-e29b-41d4-a716-446655440000",
    }),
    url: z.string().openapi({
      description: "Public URL to access the file",
      example: "https://example.com/files/image.png",
    }),
  })
  .openapi(SCHEMA_REGISTRY.FILE);

export type File = z.infer<typeof File>;
