import { useAppContext } from "@/contexts/app-provider";
import { useChatContext } from "@/contexts/chat-provider";
import useDelay from "@/hooks/use-delay";
import { cn } from "@/lib/utils";
import styles from "@/styles/income-message.module.css";
import { Message } from "@packages/schemas";
import { buildFileURL } from "@packages/ui/utils/build-file-url";
import { ChatUtils } from "@packages/ui/utils/chat-utils";
import { getInitials } from "@packages/ui/utils/get-initials";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "../common/avatar";

type IncomeMessageProps = {
	message: Message;
	onclick: () => void;
};

export default function IncomeMessage({ message, onclick }: IncomeMessageProps) {
	const { t } = useTranslation();
	const [isClicked, setIsClicked] = useState(false);
	const { user: me } = useAppContext();
	const { chat } = useChatContext();

	if (!chat || !me) throw new Error();

	const utils = new ChatUtils(chat, me);
	const displayName = utils.getDisplayNameById(message.author.id)!;

	const getText = (): string => {
		if (message.content)
			return t("chats.income-message.text", {
				name: displayName,
				text: message.content.substring(0, 20),
			});
		return t("chats.income-message.only-files", {
			name: displayName,
			count: message.files.length,
		});
	};

	const handleClick = () => {
		setIsClicked(true);
		onclick();
	};

	useDelay(() => setIsClicked(true), 5000);

	return (
		<button
			onClick={handleClick}
			className={cn(
				"absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-x-4 rounded-md bg-slate-300 p-4 transition-all hover:bg-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600",
				styles.incomeMessage,
				{ hidden: isClicked },
			)}
		>
			<Avatar
				src={buildFileURL(message.author.photoURL, { type: "avatar" })}
				alt={getInitials(message.author)}
				className="h-8 w-8 text-xs"
			/>
			<div className="font-semibold">{getText()}</div>
		</button>
	);
}
