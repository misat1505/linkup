import React from "react";
import LoginForm from "../components/login/LoginForm";
import LoginFormProvider from "../contexts/LoginFormProvider";
import LoginPageLogo from "../components/login/LoginPageLogo";
import NoAccount from "../components/login/NoAccount";

export default function Login() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 p-4 rounded-lg w-80">
      <LoginPageLogo />
      <LoginFormProvider>
        <LoginForm />
      </LoginFormProvider>
      <NoAccount />
    </div>
  );
}
