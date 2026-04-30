import { useAppContext } from "@/contexts/app-provider";
import { buildFileURL } from "@/utils/build-file-url";
import { getInitials } from "@/utils/get-initials";
import { Avatar } from "@packages/ui";
import { FaUser } from "react-icons/fa";

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
      src={buildFileURL(user.photoURL, { type: "avatar" })}
      alt={getInitials(user)}
    />
  );
}
