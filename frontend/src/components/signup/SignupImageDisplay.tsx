import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FaUser } from "react-icons/fa";

type SignupImageDisplayProps = {
  file: string | null;
};

export default function SignupImageDisplay({ file }: SignupImageDisplayProps) {
  return (
    <Avatar className="w-40 h-40 mx-auto">
      <AvatarImage className="object-cover h-full" src={file!} />
      <AvatarFallback>
        <FaUser className="h-full pt-10 flex-grow text-slate-600" />
      </AvatarFallback>
    </Avatar>
  );
}
