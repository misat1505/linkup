import React, { MouseEvent, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaUser } from "react-icons/fa";
import { useSignupFormContext } from "../../contexts/SignupFormProvider";

export default function SignupImageDisplay() {
  const { file: fileData, removeFile } = useSignupFormContext();

  const file = useMemo(
    () => (fileData ? URL.createObjectURL(fileData) : null),
    [fileData]
  );

  const handleRemoveFile = (e: MouseEvent) => {
    e.preventDefault();
    removeFile();
  };

  return (
    <Avatar className="mx-auto h-40 w-40">
      <div className="group relative">
        <AvatarImage className="object-cover" src={file!} />
        {file && (
          <button
            onClick={handleRemoveFile}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:cursor-pointer group-hover:opacity-100"
          >
            Remove
          </button>
        )}
      </div>
      <AvatarFallback>
        <FaUser className="h-full flex-grow pt-10 text-slate-600" />
      </AvatarFallback>
    </Avatar>
  );
}
