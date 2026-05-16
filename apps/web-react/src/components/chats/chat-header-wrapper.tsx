import { useAppContext } from "@/contexts/app-provider";
import { useChatPageContext } from "@/contexts/chat-page-provider";
import { queryKeys } from "@/lib/query-keys";
import { ChatService } from "@/services/chat.service";
import { Chat } from "@packages/schemas";
import { ChatHeader } from "@packages/ui/components/features/chats/chat-header";
import { ChatLeaveDialog } from "@packages/ui/components/features/chats/chat-leave-dialog";
import { ChatSettingsDialog } from "@packages/ui/components/features/chats/chat-settings/chat-settings-dialog";
import { useQueryClient } from "react-query";
import ChatMembersDisplayerWrapper from "./chat-settings/chat-members-displayer";
import GroupChatContent from "./chat-settings/group-chat-content";

export default function ChatHeaderWrapper({ chatId }: { chatId: Chat["id"] }) {
	const queryClient = useQueryClient();
	const { chats } = useChatPageContext();
	const { user: me } = useAppContext();

	const chat = chats?.find((c) => c.id === chatId);

	if (!me || !chat) throw new Error();

	function leaveChatCb(id: Chat["id"]) {
		queryClient.setQueryData<Chat[]>(queryKeys.chats(), (oldChats) => {
			if (!oldChats) return [];

			const newChats = oldChats.filter((c) => c.id !== id);
			return newChats;
		});
	}

	return (
		<ChatHeader
			chat={chat}
			me={me}
			slots={{
				chatLeaveDialog: (
					<ChatLeaveDialog
						chatId={chatId}
						leaveChatAction={ChatService.leaveChat}
						leaveChatCb={leaveChatCb}
					/>
				),
				chatSettingsDialog: (
					<ChatSettingsDialog
						chat={chat}
						slots={{
							privateChatContent: <ChatMembersDisplayerWrapper />,
							groupChatContent: <GroupChatContent />,
						}}
					/>
				),
			}}
		/>
	);
}
