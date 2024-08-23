import Avatar from "../../../components/common/Avatar";
import { API_URL } from "../../../constants";
import { cn } from "../../../lib/utils";
import { User } from "../../../models/User";
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
        "my-1 flex w-full items-center gap-x-2 rounded-md bg-slate-200 p-2 hover:bg-slate-300",
        className
      )}
    >
      <Avatar
        src={`${API_URL}/files/${user.photoURL!}`}
        alt={getInitials(user)}
        className="h-8 w-8 text-xs"
      />
      <p>
        {user.firstName} {user.lastName}
      </p>
    </button>
  );
}
