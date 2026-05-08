import z from "zod";
import { SCHEMA_REGISTRY } from "../registry";

export const LOGIN_VALIDATION = {
  login: { min: 5, max: 50 },
  password: { min: 5 },
} as const;

export const LoginDTO = z
  .object({
    login: z
      .string()
      .min(LOGIN_VALIDATION.login.min)
      .max(LOGIN_VALIDATION.login.max)
      .openapi({
        description: "User login (username or email depending on system)",
        example: "john_doe",
      }),
    password: z.string().min(LOGIN_VALIDATION.password.min).openapi({
      description: "User password",
      example: "securePassword123",
    }),
  })
  .openapi(SCHEMA_REGISTRY.DTO.LOGIN_DTO);

export type LoginDTO = z.infer<typeof LoginDTO>;
