import Avatar from "@/components/common/avatar";
import { cn } from "@/lib/utils";
import { User } from "@packages/schemas";
import { buildFileURL } from "@packages/ui/utils/build-file-url";
import { createFullName } from "@packages/ui/utils/create-full-name";
import { getInitials } from "@packages/ui/utils/get-initials";
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
        "my-1 flex w-full items-center gap-x-2 bg-slate-100 p-2 text-sm transition-all hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800",
        className,
      )}
    >
      <Avatar
        src={buildFileURL(user.photoURL, { type: "avatar" })}
        alt={getInitials(user)}
        className="h-8 w-8 text-xs"
      />
      <p>{createFullName(user)}</p>
    </button>
  );
}
