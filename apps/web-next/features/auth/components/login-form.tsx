"use client";
import { LoginFormSubmitButton } from "@packages/ui/components/features/login/login-form-submit-button";
import { useLoginFormContext } from "../providers/login-form-provider";
import LoginFormFields from "./login-form-fields";

export default function LoginForm() {
  const { submitForm, isSubmitting } = useLoginFormContext();

  return (
    <form onSubmit={submitForm}>
      <LoginFormFields />
      <LoginFormSubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}
