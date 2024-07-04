import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import React from "react";
import { Input } from "../ui/input";
import SignupImageDisplay from "./SignupImageDisplay";

export default function SignupImageFormField() {
  const { errors, register, watch } = useSignupFormContext();

  const fileData = watch()?.file?.[0];
  const file = fileData ? URL.createObjectURL(fileData) : null;

  return (
    <div className="w-full flex flex-col justify-center">
      <SignupImageDisplay file={file} />
      <Input
        type="file"
        className="hover:cursor-pointer mt-2"
        {...register("file")}
      />
      {errors.file && (
        <p className="text-red-500 text-sm font-semibold">
          {errors.file.message}
        </p>
      )}
    </div>
  );
}
