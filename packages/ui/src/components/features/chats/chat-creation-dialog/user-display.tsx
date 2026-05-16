import { User } from "@packages/schemas";
import { ButtonHTMLAttributes } from "react";
import { cn } from "../../../../lib/utils";
import { buildFileURL } from "../../../../utils/build-file-url";
import { createFullName } from "../../../../utils/create-full-name";
import { getInitials } from "../../../../utils/get-initials";
import { Avatar } from "../../../misc/avatar";

type UserDisplayProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	user: User;
};

export function UserDisplay({ user, className, ...rest }: UserDisplayProps) {
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
