import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import React from "react";
import SignupFormField from "./SignupFormField";
import StyledButton from "../common/StyledButton";
import SignupImageFormField from "./SignupImageFormField";

export default function SignupForm() {
  const { submitForm } = useSignupFormContext();

  return (
    <form onSubmit={submitForm}>
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
