import SignupForm from "../components/signup/SignupForm";
import SignupFormProvider from "../contexts/SignupFormProvider";
import React from "react";

export default function Signup() {
  return (
    <SignupFormProvider>
      <SignupForm />
    </SignupFormProvider>
  );
}
