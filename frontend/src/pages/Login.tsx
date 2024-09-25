import React from "react";
import LoginForm from "../components/login/LoginForm";
import LoginFormProvider from "../contexts/LoginFormProvider";
import LoginPageLogo from "../components/login/LoginPageLogo";
import NoAccount from "../components/login/NoAccount";
import LoginSlogan from "../components/login/LoginSlogan";

export default function Login() {
  return (
    <div className="min-h-[calc(100vh-5rem)] w-full grid-cols-2 px-4 xl:grid xl:px-12">
      <LoginSlogan />
      <div className="col-span-1 mx-auto mb-4 h-fit w-96 max-w-full rounded-lg bg-transparent px-4 py-8 shadow-2xl shadow-black xl:my-auto">
        <LoginPageLogo />
        <LoginFormProvider>
          <LoginForm />
        </LoginFormProvider>
        <NoAccount />
      </div>
    </div>
  );
}
