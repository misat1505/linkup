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
    <Avatar className="w-40 h-40 mx-auto">
      <button onClick={handleRemoveFile} className="relative group">
        <AvatarImage className="object-cover" src={file!} />
        <div className="absolute inset-0 flex items-center justify-center text-white opacity-0 bg-black bg-opacity-50 group-hover:opacity-100 transition-opacity duration-300 group-hover:cursor-pointer">
          Remove
        </div>
      </button>
      <AvatarFallback>
        <FaUser className="h-full pt-10 flex-grow text-slate-600" />
      </AvatarFallback>
    </Avatar>
  );
}
