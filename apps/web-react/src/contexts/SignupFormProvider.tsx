import useSignupForm, {
  useSignupFormProps,
  useSubmitFormValue,
} from "@/hooks/signup/useSignupForm";
import React, { createContext, useContext } from "react";

type FormType = "create" | "modify";

type SignupFormContextProps = useSignupFormProps & {
  children: React.ReactNode;
  type: FormType;
};

type SignupContextValue = useSubmitFormValue & { type: FormType };

const SignupFormContext = createContext<SignupContextValue>(
  {} as SignupContextValue,
);

// eslint-disable-next-line react-refresh/only-export-components
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
