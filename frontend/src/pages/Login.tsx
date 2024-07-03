import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { LoginFormType, loginFormSchema } from "../validators/auth.validators";
import { loginUser } from "../api/authAPI";
import LoginFormField from "../components/login/LoginFormField";
import LoginFormSubmitButton from "../components/login/LoginFormSubmitButton";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { LOGO_PATH } from "../constants";

export default function Login() {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-200 p-4 rounded-lg w-80"
    >
      <Avatar className="w-64 h-64 mx-auto mb-4">
        <AvatarImage className="object-cover" src={LOGO_PATH} />
        <AvatarFallback>Logo</AvatarFallback>
      </Avatar>
      <LoginFormField errors={errors} register={register} type="login" />
      <LoginFormField errors={errors} register={register} type="password" />
      <LoginFormSubmitButton isSubmitting={isSubmitting} />
      <p className="mt-4 text-sm text-center">
        Don&apos;t have an account?{" "}
        <a className="underline text-blue-700" href="/signup">
          Signup
        </a>
      </p>
    </form>
  );
}
