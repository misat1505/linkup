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
      <div className="grid h-full w-full grid-cols-4 px-12">
        <LoginSlogan />
        <div className="col-span-2 mx-auto my-auto h-fit w-96 rounded-lg bg-white px-4 py-8 shadow-xl">
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
