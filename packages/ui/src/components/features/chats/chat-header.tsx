import { Chat, User } from "@packages/schemas";
import React from "react";
import { ChatUtils } from "../../../utils/chat-utils";
import { ChatHeaderAvatar } from "./chat-header-avatar";
import ChatHeaderStatus from "./chat-header-status";
import { CloseChatButton } from "./close-chat-button";

type ChatHeaderProps = {
	chat: Chat;
	me: User;
	slots: {
		chatLeaveDialog: React.ReactNode;
		chatSettingsDialog: React.ReactNode;
	};
};

export function ChatHeader({ chat, me, slots }: ChatHeaderProps) {
	const utils = new ChatUtils(chat, me);

	const chatName = utils.getChatName();
	const lastActive = utils.getLastActive();

	return (
		<div className="flex items-center justify-between gap-x-4 p-4">
			<div className="flex grow items-center gap-x-4 overflow-hidden">
				<ChatHeaderAvatar chat={chat} me={me} />
				<div className="overflow-hidden text-nowrap text-white">
					<h2 className="font-semibold">{chatName}</h2>
					<div className="text-sm">
						<ChatHeaderStatus lastActive={lastActive} />
					</div>
				</div>
			</div>
			<div className="flex items-center gap-x-2">
				{chat.type === "GROUP" && slots.chatLeaveDialog}
				{slots.chatSettingsDialog}
				<CloseChatButton />
			</div>
		</div>
	);
}
