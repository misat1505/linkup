import React from "react";
import { useLoginFormContext } from "../../contexts/LoginFormProvider";
import LoginFormSubmitButton from "./LoginFormSubmitButton";
import LoginFormFields from "./LoginFormFields";

export default function LoginForm() {
  const { submitForm } = useLoginFormContext();

  return (
    <form onSubmit={submitForm}>
      <LoginFormFields />
      <LoginFormSubmitButton />
    </form>
  );
}
