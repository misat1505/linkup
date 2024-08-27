import { useAppContext } from "../../../contexts/AppProvider";
import React from "react";
import { FaUser } from "react-icons/fa";
import Avatar from "../Avatar";
import { getInitials } from "../../../utils/getInitials";
import { buildFileURL } from "../../../utils/buildFileURL";

export default function NavbarAvatar() {
  const { user } = useAppContext();

  if (!user) {
    return (
      <div className="flex h-12 w-12 items-center rounded-full bg-white dark:bg-black">
        <FaUser className="h-full flex-grow rounded-full pt-3 text-slate-600 dark:text-slate-400" />
      </div>
    );
  }

  return (
    <Avatar
      src={buildFileURL(user.photoURL, "avatar")}
      alt={getInitials(user)}
    />
  );
}
