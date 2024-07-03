import { useSignupFormContext } from "../../contexts/SignupFormProvider";
import React from "react";

export default function SignupImageFormField() {
  const { errors, register, watch } = useSignupFormContext();

  const fileData = watch()?.file?.[0];
  const file = fileData ? URL.createObjectURL(fileData) : null;

  return (
    <div className="w-full">
      {file && <img src={file} />}
      <input type="file" {...register("file")} />
      {errors.file && (
        <p className="text-red-500 text-sm font-semibold">
          {errors.file.message}
        </p>
      )}
    </div>
  );
}
