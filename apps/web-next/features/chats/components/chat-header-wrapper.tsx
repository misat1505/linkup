import { getMeCached } from "@/features/auth/actions/get-me";
import { Chat } from "@packages/schemas";
import { ChatHeader } from "@packages/ui/components/features/chats/chat-header";
import { ChatLeaveDialog } from "@packages/ui/components/features/chats/chat-leave-dialog";
import { ChatSettingsDialog } from "@packages/ui/components/features/chats/chat-settings/chat-settings-dialog";
import { leaveChat } from "../actions/leave-chat";
import ChatMembersDisplayerWrapper from "./chat-settings/chat-members-displayer";
import GroupChatContent from "./chat-settings/group-chat-content";

export default async function ChatHeaderWrapper({ chat }: { chat: Chat }) {
	const me = await getMeCached();

	return (
		<ChatHeader
			chat={chat}
			me={me}
			slots={{
				chatLeaveDialog: <ChatLeaveDialog chatId={chat.id} leaveChatAction={leaveChat} />,
				chatSettingsDialog: (
					<ChatSettingsDialog
						chat={chat}
						slots={{
							privateChatContent: <ChatMembersDisplayerWrapper chat={chat} me={me} />,
							groupChatContent: <GroupChatContent chat={chat} />,
						}}
					/>
				),
			}}
		/>
	);
}
