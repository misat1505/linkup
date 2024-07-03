import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import React from "react";
import SignupFormField from "./SignupFormField";
import StyledButton from "../common/StyledButton";
import SignupImageFormField from "./SignupImageFormField";

export default function SignupForm() {
  const { handleSubmit, onSubmit } = useSignupFormContext();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SignupFormField type="firstName" />
      <SignupFormField type="lastName" />
      <SignupFormField type="login" />
      <SignupFormField type="password" />
      <SignupFormField type="confirmPassword" />
      <SignupImageFormField />
      <StyledButton>Sign up</StyledButton>
    </form>
  );
}
