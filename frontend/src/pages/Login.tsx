import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { LoginFormType, loginFormSchema } from "../validators/auth.validators";
import { loginUser } from "../api/authAPI";
import StyledButton from "../components/common/StyledButton";

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
      <div className="w-full">
        <input
          className={`w-full bg-transparent p-2 my-2 border-b-2 border-b-slate-400 ${
            errors.login ? "outline-red-500" : ""
          }`}
          placeholder="login"
          {...register("login")}
        />
        {errors.login && (
          <p className="text-red-500 text-sm font-semibold">
            {errors.login.message}
          </p>
        )}
      </div>
      <div className="w-full">
        <input
          className={`w-full bg-transparent p-2 my-2 border-b-2 border-b-slate-400 ${
            errors.login ? "outline-red-500" : ""
          }`}
          placeholder="password"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-red-500 text-sm font-semibold">
            {errors.password.message}
          </p>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <StyledButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Sign in"}
        </StyledButton>
      </div>
    </form>
  );
}
