import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaUser } from "react-icons/fa";
import { useSignupFormContext } from "../../contexts/SignupFormProvider";

export default function SignupImageDisplay() {
  const { file: fileData } = useSignupFormContext();

  const file = fileData ? URL.createObjectURL(fileData) : null;

  return (
    <Avatar className="w-40 h-40 mx-auto">
      <AvatarImage className="object-cover h-full" src={file!} />
      <AvatarFallback>
        <FaUser className="h-full pt-10 flex-grow text-slate-600" />
      </AvatarFallback>
    </Avatar>
  );
}
