import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import React from "react";

type SignupFormFieldProps = {
  type: "firstName" | "lastName" | "login" | "password" | "confirmPassword";
};

export default function SignupFormField({ type }: SignupFormFieldProps) {
  const { errors, register } = useSignupFormContext();
  const isPassword = ["password", "confirmPassword"].includes(type);

  const placeholderTextMap = {
    firstName: "First name",
    lastName: "Last name",
    login: "Login",
    password: "Password",
    confirmPassword: "Confirm password",
  };

  return (
    <div className="w-full">
      <input
        className={`w-full bg-transparent p-2 my-2 border-b-2 border-b-slate-400 ${
          errors[type] ? "outline-red-500" : ""
        }`}
        placeholder={placeholderTextMap[type]}
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
