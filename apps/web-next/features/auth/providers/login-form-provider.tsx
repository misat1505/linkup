"use client";
import React, { createContext, useContext } from "react";
import useLoginForm, { useLoginFormValue } from "../hooks/use-login-form";

type LoginFormContextProps = {
  children: React.ReactNode;
};

type LoginContextValue = useLoginFormValue;

const LoginFormContext = createContext<LoginContextValue>(
  {} as LoginContextValue,
);

export const useLoginFormContext = () => useContext(LoginFormContext);

const LoginFormProvider = ({ children }: LoginFormContextProps) => {
  return (
    <LoginFormContext.Provider value={useLoginForm()}>
      {children}
    </LoginFormContext.Provider>
  );
};

export default LoginFormProvider;
