import { I18nText } from "@/components/i18n-text";
import { getMeCached } from "@/features/auth/actions/get-me";
import { NavigationList } from "@packages/ui/components/features/chats/chat-navigation-list";
import { NoChats } from "@packages/ui/components/features/chats/no-chats";
import { getChatsCached } from "../actions/get-chats";
import { sortChatsByActivity } from "../utils/sort-chats-by-activity";
import ChatCreatorWrapper from "./chat-creator-wrapper";
import { ChatNavigationHide } from "./chat-navigation-hide";

export default async function ChatNavigation() {
	const [chats, me] = await Promise.all([getChatsCached(), getMeCached()]);

	const sortedChats = sortChatsByActivity(chats);

	return (
		<ChatNavigationHide>
			<ChatNavigationHeader />
			<div
				className="no-scrollbar h-[calc(100vh-8rem)] overflow-auto relative"
				data-testid="cy-chat-nav"
			>
				{sortedChats.length === 0 && <NoChats />}
				<NavigationList chats={sortedChats!} me={me!} />
			</div>
		</ChatNavigationHide>
	);
}

function ChatNavigationHeader() {
	return (
		<div className="flex w-full items-center justify-between bg-transparent px-4 py-2 text-white">
			<h2 className="text-lg font-semibold">
				<I18nText translationKey="chats.navigation.title" />
			</h2>
			<ChatCreatorWrapper />
		</div>
	);
}
