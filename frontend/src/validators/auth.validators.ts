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

export const useSignupFormSchema = () => {
  const { t } = useTranslation();

  return z
    .object({
      firstName: z
        .string()
        .min(1, t("signup.form.errors.firstname.min"))
        .max(50, t("signup.form.errors.firstname.max")),
      lastName: z
        .string()
        .min(1, t("signup.form.errors.lastname.min"))
        .max(50, t("signup.form.errors.lastname.max")),
      login: z
        .string()
        .min(5, t("signup.form.errors.login.min"))
        .max(50, t("signup.form.errors.login.max")),
      password: z.string().min(5, t("signup.form.errors.password.min")),
      confirmPassword: z.string().min(5, t("signup.form.errors.password.min")),
      file: z.instanceof(File).nullable(),
    })
    .refine((ctx) => ctx.password === ctx.confirmPassword, {
      message: t("signup.form.errors.password.mismatch"),
      path: ["confirmPassword"],
    });
};

export type SignupFormType = z.infer<ReturnType<typeof useSignupFormSchema>>;
