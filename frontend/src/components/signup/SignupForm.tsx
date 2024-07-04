import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import React from "react";
import SignupImageFormField from "./SignupImageFormField";
import SignupSubmitButton from "./SignupSubmitButton";
import SignupFormFields from "./SignupFormFields";

export default function SignupForm() {
  const { submitForm } = useSignupFormContext();

  return (
    <form onSubmit={submitForm}>
      <div className="grid grid-cols-2 gap-x-4">
        <SignupFormFields />
        <SignupImageFormField />
      </div>
      <SignupSubmitButton />
    </form>
  );
}
