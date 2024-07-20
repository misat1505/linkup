import AlreadyHaveAccount from "../components/signup/AlreadyHaveAccount";
import SignupForm from "../components/signup/SignupForm";
import SignupFormProvider from "../contexts/SignupFormProvider";
import React from "react";

export default function Signup() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-slate-200 p-4">
      <SignupFormProvider>
        <SignupForm />
      </SignupFormProvider>
      <AlreadyHaveAccount />
    </div>
  );
}
