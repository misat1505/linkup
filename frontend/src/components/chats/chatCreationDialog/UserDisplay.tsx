import { buildFileURL } from "../../../utils/buildFileURL";
import Avatar from "../../../components/common/Avatar";
import { cn } from "../../../lib/utils";
import { User } from "../../../types/User";
import { getInitials } from "../../../utils/getInitials";
import { ButtonHTMLAttributes } from "react";

type UserDisplayProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  user: User;
};

export default function UserDisplay({
  user,
  className,
  ...rest
}: UserDisplayProps) {
  return (
    <button
      {...rest}
      className={cn(
        "my-1 flex w-full items-center gap-x-2 rounded-md bg-slate-200 p-2 transition-all hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700",
        className
      )}
    >
      <Avatar
        src={buildFileURL(user.photoURL, { type: "avatar" })}
        alt={getInitials(user)}
        className="h-8 w-8 text-xs"
      />
      <p>
        {user.firstName} {user.lastName}
      </p>
    </button>
  );
}
