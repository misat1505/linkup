import React from "react";
import { useLoginFormContext } from "../../contexts/LoginFormProvider";
import { Input } from "../ui/input";

type LoginFormFieldProps = {
  type: "login" | "password";
};

export default function LoginFormField({ type }: LoginFormFieldProps) {
  const { errors, register } = useLoginFormContext();
  const isPassword = type === "password";

  return (
    <div className="w-full">
      <Input
        className={`w-full bg-transparent p-2 my-2 border-b-2 border-b-slate-400 ${
          errors[type]
            ? "focus-visible:ring-red-500 ring-2 ring-offset-2 mt-4 ring-red-500"
            : ""
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
