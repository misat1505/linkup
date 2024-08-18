import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({
  override: true,
  path: process.env.NODE_ENV === "test" ? ".env.test" : ".env",
});

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development", "test"], {
    message:
      "'NODE_ENV' has to be one of: 'production', 'development', 'test'.",
  }),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "'PORT' must be a number.",
    }),
  SOCKET_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "'SOCKET_PORT' must be a number.",
    }),
  JWT_SECRET: z.string().min(20, {
    message: "'JWT_SECRET' needs to be at least 20 characters long.",
  }),
  DATABASE_URL: z.string({ message: "'DATABASE_URL' must be a string" }),
  FRONTEND_URL: z.string().url({
    message: "'FRONTEND_URL' must be a valid URL.",
  }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
