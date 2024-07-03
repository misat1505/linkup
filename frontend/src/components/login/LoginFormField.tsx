import React from "react";
import { LoginFormType } from "../../validators/auth.validators";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type LoginFormFieldProps = {
  type: "login" | "password";
  register: UseFormRegister<LoginFormType>;
  errors: FieldErrors<LoginFormType>;
};

export default function LoginFormField({
  errors,
  register,
  type,
}: LoginFormFieldProps) {
  const isPassword = type === "password";

  return (
    <div className="w-full">
      <input
        className={`w-full bg-transparent p-2 my-2 border-b-2 border-b-slate-400 ${
          errors[type] ? "outline-red-500" : ""
        }`}
        placeholder={type}
        type={isPassword ? "password" : "text"}
        {...register(type)}
      />
      {errors[type] && (
        <p className="text-red-500 text-sm font-semibold">
          {errors[type]?.message}
        </p>
      )}
    </div>
  );
}
