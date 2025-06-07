import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "development", "test", "e2e"], {
    message:
      "'NODE_ENV' has to be one of: 'production', 'development', 'test', 'e2e'.",
  }),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), {
      message: "'PORT' must be a number.",
    }),
  ACCESS_TOKEN_SECRET: z.string().min(20, {
    message: "'ACCESS_TOKEN_SECRET' needs to be at least 20 characters long.",
  }),
  REFRESH_TOKEN_SECRET: z.string().min(20, {
    message: "'REFRESH_TOKEN_SECRET' needs to be at least 20 characters long.",
  }),
  DATABASE_URL: z.string({ message: "'DATABASE_URL' must be a string" }),
  FRONTEND_URL: z.string().url({
    message: "'FRONTEND_URL' must be a valid URL.",
  }),

  AWS_ACCESS_KEY_ID: z.string({
    message: "'AWS_ACCESS_KEY_ID' must be a string",
  }),
  AWS_SECRET_ACCESS_KEY: z.string({
    message: "'AWS_SECRET_ACCESS_KEY' must be a string",
  }),
  AWS_REGION: z.string({ message: "'AWS_REGION' must be a string" }),
  S3_BUCKET_NAME: z.string({ message: "'S3_BUCKET_NAME' must be a string" }),
  S3_ENDPOINT: z.string({ message: "'S3_ENDPOINT' must be a string" }),
  SENTRY_DSN: z
    .string()
    .url({ message: "'SENTRY_DSN' must be a valid URL." })
    .optional(),
  DO_NOT_SIGN_OBJECTS: z
    .string()
    .optional()
    .transform((val) => val === "true"),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid environment variables:", parsedEnv.error.format());
  process.exit(1);
}

export const env = parsedEnv.data;
