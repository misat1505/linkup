import z from "zod";
import { SCHEMA_REGISTRY } from "../registry";

export const LoginDTO = z
  .object({
    login: z.string().min(5).max(50).openapi({
      description: "User login (username or email depending on system)",
      example: "john_doe",
    }),
    password: z.string().min(5).openapi({
      description: "User password",
      example: "securePassword123",
    }),
  })
  .openapi(SCHEMA_REGISTRY.DTO.LOGIN_DTO);

export type LoginDTO = z.infer<typeof LoginDTO>;
