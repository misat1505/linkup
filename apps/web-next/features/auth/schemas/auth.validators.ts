import { useLanguageContext } from "@/providers/language-provider";
import {
  LOGIN_VALIDATION,
  LoginDTO,
  SIGNUP_VALIDATION,
  SignupDTO,
} from "@packages/schemas";
import { z } from "zod";

export const useLoginFormSchema = () => {
  const { t } = useLanguageContext();

  return z.object({
    login: z
      .string()
      .min(LOGIN_VALIDATION.login.min, t("login.form.errors.login.min"))
      .max(LOGIN_VALIDATION.login.max, t("login.form.errors.login.max")),
    password: z.string().min(5, t("login.form.errors.password.min")),
  });
};

// CICD build requires not to infer types from ReturnType
export type LoginFormType = LoginDTO;

export const useSignupFormSchema = () => {
  const { t } = useLanguageContext();

  return z
    .object({
      firstName: z
        .string()
        .min(
          SIGNUP_VALIDATION.firstName.min,
          t("signup.form.errors.firstname.min"),
        )
        .max(
          SIGNUP_VALIDATION.firstName.max,
          t("signup.form.errors.firstname.max"),
        ),
      lastName: z
        .string()
        .min(
          SIGNUP_VALIDATION.lastName.min,
          t("signup.form.errors.lastname.min"),
        )
        .max(
          SIGNUP_VALIDATION.lastName.max,
          t("signup.form.errors.lastname.max"),
        ),
      login: z
        .string()
        .min(SIGNUP_VALIDATION.login.min, t("signup.form.errors.login.min"))
        .max(SIGNUP_VALIDATION.login.max, t("signup.form.errors.login.max")),
      password: z
        .string()
        .min(
          SIGNUP_VALIDATION.password.min,
          t("signup.form.errors.password.min"),
        ),
      confirmPassword: z
        .string()
        .min(
          SIGNUP_VALIDATION.password.min,
          t("signup.form.errors.password.min"),
        ),
      file: z.instanceof(File).nullable(),
    })
    .refine((ctx) => ctx.password === ctx.confirmPassword, {
      message: t("signup.form.errors.password.mismatch"),
      path: ["confirmPassword"],
    });
};

// CICD build requires not to infer types from ReturnType
export type SignupFormType = Omit<SignupDTO, "file"> & {
  confirmPassword: string;
  file: File | null;
};
