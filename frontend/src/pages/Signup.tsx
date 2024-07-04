import SignupForm from "../components/signup/SignupForm";
import SignupFormProvider from "../contexts/SignupFormProvider";
import React from "react";

export default function Signup() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 rounded-lg p-4">
      <SignupFormProvider>
        <SignupForm />
      </SignupFormProvider>
    </div>
  );
}
