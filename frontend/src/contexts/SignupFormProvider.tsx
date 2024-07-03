import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import {
  SignupFormType,
  signupFormSchema,
} from "../validators/auth.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../api/authAPI";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type SignupFormContextProps = {
  children: React.ReactNode;
};

type SignupFormEntries = {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  confirmPassword: string;
  file?: File | undefined;
};

type LoginContextValue = {
  register: UseFormRegister<SignupFormEntries>;
  handleSubmit: UseFormHandleSubmit<SignupFormEntries, undefined>;
  errors: FieldErrors<SignupFormEntries>;
  isSubmitting: boolean;
  onSubmit: SubmitHandler<SignupFormEntries>;
};

const SignupFormContext = createContext<LoginContextValue>(
  {} as LoginContextValue
);

export const useSignupFormContext = () => useContext(SignupFormContext);

export const SignupFormProvider = ({ children }: SignupFormContextProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormType>({
    resolver: zodResolver(signupFormSchema),
  });

  const onSubmit: SubmitHandler<SignupFormType> = async (data) => {
    try {
      // await loginUser(data);
      navigate("/");
    } catch (e: unknown) {
      if (e instanceof AxiosError) {
        toast.error(e.response?.data.message);
      }
    }
  };

  return (
    <SignupFormContext.Provider
      value={{
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
      }}
    >
      {children}
    </SignupFormContext.Provider>
  );
};

export default SignupFormProvider;
