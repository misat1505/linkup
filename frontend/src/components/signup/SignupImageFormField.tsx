import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import React from "react";
import { Input } from "../ui/input";
import SignupImageDisplay from "./SignupImageDisplay";

export default function SignupImageFormField() {
  const { errors, register } = useSignupFormContext();

  return (
    <div className="flex w-full flex-col justify-center">
      <SignupImageDisplay />
      <Input
        type="file"
        accept=".jpg, .webp, .png"
        className="mt-2 hover:cursor-pointer"
        {...register("file")}
      />
      {errors.file && (
        <p className="text-sm font-semibold text-red-500">
          {errors.file.message}
        </p>
      )}
    </div>
  );
}
