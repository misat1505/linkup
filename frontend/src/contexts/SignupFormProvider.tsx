import React, { createContext, useContext } from "react";
import useSignupForm, {
  useSubmitFormValue,
} from "../hooks/signup/useSignupForm";

type SignupFormContextProps = {
  children: React.ReactNode;
};

type SignupContextValue = useSubmitFormValue;

const SignupFormContext = createContext<SignupContextValue>(
  {} as SignupContextValue
);

export const useSignupFormContext = () => useContext(SignupFormContext);

export const SignupFormProvider = ({ children }: SignupFormContextProps) => {
  return (
    <SignupFormContext.Provider value={useSignupForm()}>
      {children}
    </SignupFormContext.Provider>
  );
};

export default SignupFormProvider;
