import React from "react";
import LoginFormField from "./LoginFormField";
import { useLoginFormContext } from "../../contexts/LoginFormProvider";
import LoginFormSubmitButton from "./LoginFormSubmitButton";

export default function LoginForm() {
  const { submitForm } = useLoginFormContext();

  return (
    <form onSubmit={submitForm}>
      <LoginFormField type="login" />
      <LoginFormField type="password" />
      <LoginFormSubmitButton />
    </form>
  );
}
