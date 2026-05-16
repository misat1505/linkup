"use client";

import useUserSearch from "@/hooks/use-user-search";
import { useLanguageContext } from "@/providers/language-provider";
import { Chat } from "@packages/schemas";
import { UserSearchDisplayer } from "@packages/ui/components/features/chats/chat-settings/user-invite";
import { Input } from "@packages/ui/components/shadcn/input";
import { useState } from "react";
import { addUserToChat } from "../../actions/add-user-to-chat";

export default function UserInvite({ chat }: { chat: Chat }) {
	const { t } = useLanguageContext();
	const [text, setText] = useState("");
	const { data } = useUserSearch(text);

	const filteredUsers = data?.filter((user) => !chat.users!.some((u) => u.id === user.id));

	return (
		<div>
			<Input
				placeholder={t("chats.settings.group.invite.search.placeholder")}
				className="my-2"
				onChange={(e) => setText(e.currentTarget.value)}
			/>
			<UserSearchDisplayer
				users={filteredUsers}
				chatId={chat.id}
				addUserToChatAction={addUserToChat}
			/>
		</div>
	);
}
