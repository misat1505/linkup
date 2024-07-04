import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import React from "react";
import SignupFormField from "./SignupFormField";
import StyledButton from "../common/StyledButton";
import SignupImageFormField from "./SignupImageFormField";
import SignupSubmitButton from "./SignupSubmitButton";

export default function SignupForm() {
  const { submitForm } = useSignupFormContext();

  return (
    <form onSubmit={submitForm}>
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <SignupFormField type="firstName" />
          <SignupFormField type="lastName" />
          <SignupFormField type="login" />
          <SignupFormField type="password" />
          <SignupFormField type="confirmPassword" />
        </div>
        <SignupImageFormField />
      </div>
      <SignupSubmitButton />
    </form>
  );
}
