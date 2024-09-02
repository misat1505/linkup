import React, { createContext, useContext } from "react";
import useSignupForm, {
  useSignupFormProps,
  useSubmitFormValue
} from "../hooks/signup/useSignupForm";

type FormType = "create" | "modify";

type SignupFormContextProps = useSignupFormProps & {
  children: React.ReactNode;
  type: FormType;
};

type SignupContextValue = useSubmitFormValue & { type: FormType };

const SignupFormContext = createContext<SignupContextValue>(
  {} as SignupContextValue
);

export const useSignupFormContext = () => useContext(SignupFormContext);

export const SignupFormProvider = ({
  children,
  type,
  ...props
}: SignupFormContextProps) => {
  return (
    <SignupFormContext.Provider value={{ ...useSignupForm(props), type }}>
      {children}
    </SignupFormContext.Provider>
  );
};

export default SignupFormProvider;
