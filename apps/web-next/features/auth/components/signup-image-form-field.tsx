import { Input, SignupImageDisplay } from "@packages/ui";
import { useSignupFormContext } from "../providers/signup-form-provider";

export default function SignupImageFormField() {
  const { errors, setValue, file, removeFile, data } = useSignupFormContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue("file", file, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="flex w-full flex-col justify-center">
      <SignupImageDisplay data={data} fileData={file} removeFile={removeFile} />
      <Input
        type="file"
        accept=".jpg, .webp, .png"
        className="mt-2 hover:cursor-pointer"
        onChange={handleFileChange}
      />
      {errors.file && (
        <p className="text-sm font-semibold text-red-500">
          {errors.file.message}
        </p>
      )}
    </div>
  );
}
