import { User } from "@packages/schemas";
import { MouseEvent, useMemo } from "react";
import { FaUser } from "react-icons/fa";
import { TRANSLATION_COMPONENT } from "../../../config";
import { getInitials } from "../../../utils/get-initials";
import { AvatarFallback, AvatarImage, ShadcnAvatar } from "../../shadcn/avatar";

type SignupImageDisplayProps = {
  fileData: File | null;
  removeFile: () => void;
  data: Pick<User, "firstName" | "lastName">;
};

export function SignupImageDisplay({
  data,
  fileData,
  removeFile,
}: SignupImageDisplayProps) {
  const file = useMemo(
    () => (fileData ? URL.createObjectURL(fileData) : null),
    [fileData],
  );

  const handleRemoveFile = (e: MouseEvent) => {
    e.preventDefault();
    removeFile();
  };

  return (
    <ShadcnAvatar className="mx-auto h-40 w-40 mt-4 md:mt-0">
      <div className="group relative">
        <AvatarImage className="object-cover" src={file!} />
        {file && (
          <button
            onClick={handleRemoveFile}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:cursor-pointer group-hover:opacity-100"
          >
            <TRANSLATION_COMPONENT translationKey="signup.form.remove-image" />
          </button>
        )}
      </div>
      <AvatarFallback>
        {data.firstName && data.lastName ? (
          <div className="text-7xl font-semibold">
            {getInitials(data as User)}
          </div>
        ) : (
          <FaUser className="h-full flex-grow pt-10 text-slate-600" />
        )}
      </AvatarFallback>
    </ShadcnAvatar>
  );
}
