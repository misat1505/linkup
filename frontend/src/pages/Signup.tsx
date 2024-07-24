import SignupSlogan from "../components/signup/SignupSlogan";
import BgGradient from "../components/common/BgGradient";
import AlreadyHaveAccount from "../components/signup/AlreadyHaveAccount";
import SignupForm from "../components/signup/SignupForm";
import SignupFormProvider from "../contexts/SignupFormProvider";
import React from "react";

export default function Signup() {
  return (
    <BgGradient>
      <div className="h-full w-full grid-cols-2 px-12 xl:grid">
        <SignupSlogan />
        <div className="col-span-1 mx-auto my-auto h-fit w-fit rounded-lg bg-white p-4 shadow-xl">
          <SignupFormProvider>
            <SignupForm />
          </SignupFormProvider>
          <AlreadyHaveAccount />
        </div>
      </div>
    </BgGradient>
  );
}
