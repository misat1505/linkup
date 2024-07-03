import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { LoginFormType, loginFormSchema } from "../validators/auth.validators";
import { loginUser } from "../api/authAPI";
import StyledButton from "../components/common/StyledButton";
import LoginFormField from "../components/login/LoginFormField";

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
      <LoginFormField errors={errors} register={register} type="login" />
      <LoginFormField errors={errors} register={register} type="password" />
      <div className="flex justify-center mt-4">
        <StyledButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Sign in"}
        </StyledButton>
      </div>
    </form>
  );
}
