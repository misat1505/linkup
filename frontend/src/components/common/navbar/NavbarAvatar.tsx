import { useAppContext } from "../../../contexts/AppProvider";
import React from "react";
import Image from "../Image";
import { API_URL } from "../../../constants";
import { FaUser } from "react-icons/fa";
import Avatar from "../Avatar";
import { getInitials } from "../../../utils/getInitials";

export default function NavbarAvatar() {
  const { user } = useAppContext();

  if (!user) {
    return (
      <div className="flex h-12 w-12 items-center rounded-full bg-white">
        <FaUser className="h-full flex-grow rounded-full pt-3 text-slate-600" />
      </div>
    );
  }

  const { firstName, lastName } = user;

  return (
    <Avatar
      src={`${API_URL}/files/${user.photoURL}`}
      alt={getInitials({ firstName, lastName })}
    />
  );
}
