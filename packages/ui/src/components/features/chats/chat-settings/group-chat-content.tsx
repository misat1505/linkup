"use client";

import { TRANSLATION_COMPONENT } from "../../../../config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shadcn/tabs";

type GroupChatContentProps = {
	slots: {
		chatInfoUpdater: React.ReactNode;
		chatMembersDisplayer: React.ReactNode;
		userInvite: React.ReactNode;
	};
};

export function GroupChatContent({ slots }: GroupChatContentProps) {
	return (
		<Tabs defaultValue="overrall">
			<TabsList className="grid w-full grid-cols-3">
				<TabsTrigger value="overrall">
					<TRANSLATION_COMPONENT translationKey="chats.settings.group.tabs.general" />
				</TabsTrigger>
				<TabsTrigger value="members">
					<TRANSLATION_COMPONENT translationKey="chats.settings.group.tabs.members" />
				</TabsTrigger>
				<TabsTrigger value="invite">
					<TRANSLATION_COMPONENT translationKey="chats.settings.group.tabs.invite" />
				</TabsTrigger>
			</TabsList>
			<TabsContent value="overrall">{slots.chatInfoUpdater}</TabsContent>
			<TabsContent value="members">{slots.chatMembersDisplayer}</TabsContent>
			<TabsContent value="invite">{slots.userInvite}</TabsContent>
		</Tabs>
	);
}
