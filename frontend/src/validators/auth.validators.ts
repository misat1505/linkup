import { z } from "zod";

export const loginFormSchema = z.object({
  login: z
    .string()
    .min(5, "Login must be at least 5 characters long.")
    .max(50, "Login must be at most 50 characters long."),
  password: z.string().min(5, "Password must be at least 5 characters long."),
});

export type LoginFormType = z.infer<typeof loginFormSchema>;
