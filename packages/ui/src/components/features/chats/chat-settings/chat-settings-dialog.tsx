import { Chat } from "@packages/schemas";
import { CiSettings } from "react-icons/ci";
import { TRANSLATION_COMPONENT } from "../../../../config";
import { Tooltip } from "../../../misc/tooltip";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../../../shadcn/dialog";

export type ChatSettingsDialogProps = {
	chat: Chat;
	slots: {
		privateChatContent: React.ReactNode;
		groupChatContent: React.ReactNode;
	};
};

export function ChatSettingsDialog({ chat, slots }: ChatSettingsDialogProps) {
	return (
		<Dialog>
			<DialogTrigger asChild className="aspect-square h-5 w-5">
				<span>
					<Tooltip
						content={<TRANSLATION_COMPONENT translationKey="chats.settings.trigger.tooltip" />}
					>
						<button>
							<CiSettings size={20} className="transition-all hover:scale-125" />
						</button>
					</Tooltip>
				</span>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						<TRANSLATION_COMPONENT translationKey="chats.settings.title" />
					</DialogTitle>
					<DialogDescription>
						{chat.type === "PRIVATE" ? (
							<TRANSLATION_COMPONENT translationKey="chats.settings.description.private" />
						) : (
							<TRANSLATION_COMPONENT translationKey="chats.settings.description.group" />
						)}
					</DialogDescription>
				</DialogHeader>
				{chat.type === "PRIVATE" ? slots.privateChatContent : slots.groupChatContent}
			</DialogContent>
		</Dialog>
	);
}
