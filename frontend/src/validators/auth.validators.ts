import { useTranslation } from "react-i18next";
import { z } from "zod";

export const useLoginFormSchema = () => {
  const { t } = useTranslation();

  return z.object({
    login: z
      .string()
      .min(5, t("login.form.errors.login.min"))
      .max(50, t("login.form.errors.login.max")),
    password: z.string().min(5, t("login.form.errors.password.min")),
  });
};

export type LoginFormType = z.infer<ReturnType<typeof useLoginFormSchema>>;

export const signupFormSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name must not be empty.")
      .max(50, "First name must be at most 50 characters long."),
    lastName: z
      .string()
      .min(1, "Last name must not be empty.")
      .max(50, "Last name must be at most 50 characters long."),
    login: z
      .string()
      .min(5, "Login must be at least 5 characters long.")
      .max(50, "Login must be at most 50 characters long."),
    password: z.string().min(5, "Password must be at least 5 characters long."),
    confirmPassword: z
      .string()
      .min(5, "Password must be at least 5 characters long."),
    file: z.optional(z.instanceof(FileList)),
  })
  .refine((ctx) => ctx.password === ctx.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormType = z.infer<typeof signupFormSchema>;
