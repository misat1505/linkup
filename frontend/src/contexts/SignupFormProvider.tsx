import React, { createContext, useContext } from "react";
import useSignupForm, {
  useSignupFormProps,
  useSubmitFormValue
} from "../hooks/signup/useSignupForm";

type SignupFormContextProps = useSignupFormProps & {
  children: React.ReactNode;
};

type SignupContextValue = useSubmitFormValue;

const SignupFormContext = createContext<SignupContextValue>(
  {} as SignupContextValue
);

export const useSignupFormContext = () => useContext(SignupFormContext);

export const SignupFormProvider = ({
  children,
  ...props
}: SignupFormContextProps) => {
  return (
    <SignupFormContext.Provider value={useSignupForm(props)}>
      {children}
    </SignupFormContext.Provider>
  );
};

export default SignupFormProvider;
