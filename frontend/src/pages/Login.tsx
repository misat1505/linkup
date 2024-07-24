import React from "react";
import LoginForm from "../components/login/LoginForm";
import LoginFormProvider from "../contexts/LoginFormProvider";
import LoginPageLogo from "../components/login/LoginPageLogo";
import NoAccount from "../components/login/NoAccount";
import BgGradient from "../components/common/BgGradient";
import LoginSlogan from "../components/login/LoginSlogan";

export default function Login() {
  return (
    <BgGradient>
      <div className="absolute left-1/2 top-1/2 grid w-full -translate-x-1/2 -translate-y-1/2 grid-cols-4 px-12">
        <LoginSlogan />
        <div className="col-span-2 mx-auto h-fit w-96 rounded-lg bg-white px-4 py-8">
          <LoginPageLogo />
          <LoginFormProvider>
            <LoginForm />
          </LoginFormProvider>
          <NoAccount />
        </div>
      </div>
    </BgGradient>
  );
}
