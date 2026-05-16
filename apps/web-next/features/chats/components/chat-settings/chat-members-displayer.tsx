import { Chat, User, UserInChat } from "@packages/schemas";
import { AliasUpdateModal } from "@packages/ui/components/features/chats/chat-settings/alias-update-modal";
import { ChatMembersDisplayItem } from "@packages/ui/components/features/chats/chat-settings/chat-members-displayer";
import { createPrivateChat } from "../../actions/create-private-chats";
import { updateAlias } from "../../actions/update-alias";

export default function ChatMembersDisplayerWrapper({ chat, me }: { chat: Chat; me: User }) {
	const users = chat.users!;

	return (
		<div className="my-4 w-full">
			{users.map((user) => (
				<ChatMembersDisplayItem
					key={user.id}
					chat={chat}
					user={user}
					me={me!}
					createPrivateChatAction={createPrivateChat}
					slots={{
						aliasUpdateModal: <AliasUpdateModalWrapper user={user} chatId={chat.id} />,
					}}
				/>
			))}
		</div>
	);
}

function AliasUpdateModalWrapper({ user, chatId }: { user: UserInChat; chatId: Chat["id"] }) {
	return <AliasUpdateModal user={user} chatId={chatId as string} updateAliasAction={updateAlias} />;
}
