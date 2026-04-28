import z from "zod";
import { SCHEMA_REGISTRY } from "../registry";

export const ErrorMessage = z
  .object({
    message: z.string().openapi({
      description: "Human-readable error message",
    }),
  })
  .openapi(SCHEMA_REGISTRY.MISC.ERROR_MESSAGE);

export type ErrorMessage = z.infer<typeof ErrorMessage>;
