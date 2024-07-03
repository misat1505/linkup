import React from "react";
import LoginFormField from "./LoginFormField";
import { useLoginFormContext } from "../../contexts/LoginFormProvider";
import LoginFormSubmitButton from "./LoginFormSubmitButton";

export default function LoginForm() {
  const { handleSubmit, onSubmit } = useLoginFormContext();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <LoginFormField type="login" />
      <LoginFormField type="password" />
      <LoginFormSubmitButton />
    </form>
  );
}
