import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { LOGO_PATH } from "../constants";
import LoginForm from "../components/login/LoginForm";
import LoginFormProvider from "../contexts/LoginFormProvider";

export default function Login() {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 p-4 rounded-lg w-80">
      <Avatar className="w-64 h-64 mx-auto mb-4">
        <AvatarImage className="object-cover" src={LOGO_PATH} />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
      <LoginFormProvider>
        <LoginForm />
      </LoginFormProvider>
      <p className="mt-4 text-sm text-center">
        Don&apos;t have an account?{" "}
        <a className="underline text-blue-700" href="/signup">
          Signup
        </a>
      </p>
    </div>
  );
}
