import { useAppContext } from "../../../contexts/AppProvider";
import React from "react";
import Image from "../Image";
import { API_URL } from "../../../constants";
import { FaUser } from "react-icons/fa";

export default function NavbarAvatar() {
  const { user } = useAppContext();

  if (!user) {
    return (
      <div className="flex h-16 w-16 items-center rounded-full bg-slate-200">
        <FaUser className="h-full flex-grow rounded-full pt-4 text-slate-600" />
      </div>
    );
  }

  const initials = `${user.firstName[0].toUpperCase()}${user.lastName[0].toUpperCase()}`;

  return (
    <Image
      src={`${API_URL}/files/${user.photoURL}`}
      className={{
        common: "h-16 w-16 rounded-full bg-slate-200",
        img: "object-cover",
        error: "font-semibold"
      }}
      errorContent={initials}
    />
  );
}
