"use client";
import { useLoginFormContext } from "../providers/login-form-provider";
import LoginFormFields from "./login-form-fields";
import LoginFormSubmitButton from "./login-form-submit-button";

export default function LoginForm() {
  const { submitForm } = useLoginFormContext();

  return (
    <form onSubmit={submitForm}>
      <LoginFormFields />
      <LoginFormSubmitButton />
    </form>
  );
}
