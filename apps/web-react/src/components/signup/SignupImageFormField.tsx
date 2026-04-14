import { useSignupFormContext } from "@/contexts/SignupFormProvider";
import SignupImageDisplay from "./SignupImageDisplay";
import { Input } from "../ui/input";

export default function SignupImageFormField() {
  const { errors, setValue } = useSignupFormContext();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setValue("file", file, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="flex w-full flex-col justify-center">
      <SignupImageDisplay />
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
