import React from "react";
import LoginForm from "../components/login/LoginForm";
import LoginFormProvider from "../contexts/LoginFormProvider";
import LoginPageLogo from "../components/login/LoginPageLogo";
import NoAccount from "../components/login/NoAccount";
import BgGradient from "../components/common/BgGradient";
import LoginSlogan from "../components/login/LoginSlogan";

export default function Login() {
  return (
    <>
      <BgGradient />
      <div className="relative z-10 min-h-[calc(100vh-5rem)] w-full grid-cols-2 px-12 xl:grid">
        <LoginSlogan />
        <div className="col-span-1 mx-auto my-auto h-fit w-96 rounded-lg bg-transparent px-4 py-8 shadow-2xl shadow-black">
          <LoginPageLogo />
          <LoginFormProvider>
            <LoginForm />
          </LoginFormProvider>
          <NoAccount />
        </div>
      </div>
    </>
  );
}
