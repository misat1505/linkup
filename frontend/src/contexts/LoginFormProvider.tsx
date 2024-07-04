import React, { createContext, useContext } from "react";
import useLoginForm, { useLoginFormValue } from "../hooks/login/useLoginForm";

type LoginFormContextProps = {
  children: React.ReactNode;
};

type LoginContextValue = useLoginFormValue;

const LoginFormContext = createContext<LoginContextValue>(
  {} as LoginContextValue
);

export const useLoginFormContext = () => useContext(LoginFormContext);

export const LoginFormProvider = ({ children }: LoginFormContextProps) => {
  const { register, errors, isSubmitting, submitForm } = useLoginForm();

  return (
    <LoginFormContext.Provider
      value={{
        register,
        errors,
        isSubmitting,
        submitForm,
      }}
    >
      {children}
    </LoginFormContext.Provider>
  );
};

export default LoginFormProvider;
