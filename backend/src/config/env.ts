import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

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
  JWT_SECRET: z.string().min(20, {
    message: "'JWT_SECRET' needs to be at least 20 characters long.",
  }),

  DB_HOST: z.string({ message: "'DB_HOST' must be provided." }),
  DB_USER: z.string({ message: "'DB_USER' must be provided." }),
  DB_PASSWORD: z.string({ message: "'DB_PASSWORD' must be provided." }),
  DB_DATABASE: z.string({ message: "'DB_DATABASE' must be provided." }),
  DB_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "'DB_PORT' must be a number.",
    }),

  DB_TEST_DATABASE: z.string({
    message: "'DB_TEST_DATABASE' must be provided.",
  }),
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
