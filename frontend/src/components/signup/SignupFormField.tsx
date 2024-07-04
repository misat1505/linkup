import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import React from "react";
import { Input } from "../ui/input";

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
      <Input
        className={`w-full bg-transparent p-2 my-2 border-b-2 border-b-slate-400 ${
          errors[type]
            ? "focus-visible:ring-red-500 ring-2 ring-offset-2 mt-4 ring-red-500"
            : ""
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
