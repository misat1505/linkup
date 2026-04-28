import z from "zod";
import { SCHEMA_REGISTRY } from "../registry";

export const SuccessMessage = z
  .object({
    message: z.string().openapi({
      description: "Human-readable message",
    }),
  })
  .openapi(SCHEMA_REGISTRY.MISC.SUCCESS_MESSAGE);

export type SuccessMessage = z.infer<typeof SuccessMessage>;
