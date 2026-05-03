import { useSignupFormContext } from "@/contexts/signup-form-provider";
import { SignupImageDisplay } from "@packages/ui";
import { Input } from "../ui/input";

export default function SignupImageFormField() {
  const { errors, setValue, file, data, removeFile } = useSignupFormContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue("file", file, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="flex w-full flex-col justify-center">
      <SignupImageDisplay fileData={file} removeFile={removeFile} data={data} />
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
