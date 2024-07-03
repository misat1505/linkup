import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  FieldErrors,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
  useForm,
} from "react-hook-form";
import { LoginFormType, loginFormSchema } from "../validators/auth.validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../api/authAPI";

type LoginFormContextProps = {
  children: React.ReactNode;
};

type LoginContextValue = {
  register: UseFormRegister<{
    login: string;
    password: string;
  }>;
  handleSubmit: UseFormHandleSubmit<
    {
      login: string;
      password: string;
    },
    undefined
  >;
  errors: FieldErrors<{
    login: string;
    password: string;
  }>;
  isSubmitting: boolean;
  onSubmit: SubmitHandler<{
    login: string;
    password: string;
  }>;
};

const LoginFormContext = createContext<LoginContextValue>(
  {} as LoginContextValue
);

export const useLoginFormContext = () => useContext(LoginFormContext);

export const LoginFormProvider = ({ children }: LoginFormContextProps) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormType> = async (data) => {
    try {
      await loginUser(data);
      navigate("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <LoginFormContext.Provider
      value={{
        register,
        handleSubmit,
        errors,
        isSubmitting,
        onSubmit,
      }}
    >
      {children}
    </LoginFormContext.Provider>
  );
};

export default LoginFormProvider;
