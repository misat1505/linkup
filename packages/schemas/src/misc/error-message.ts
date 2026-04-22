import z from "zod";

export const ErrorMessage = z.object({
  message: z.string(),
});

export type ErrorMessage = z.infer<typeof ErrorMessage>;
