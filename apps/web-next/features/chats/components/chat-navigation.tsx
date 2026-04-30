import NoChats from "./no-chats";
import { ChatNavigationHide } from "./chat-navigation-hide";
import { getChatsCached } from "../actions/get-chats";
import { I18nText } from "@/components/shared/i18n-text";
import ChatCreator from "./chat-creation-dialog/chat-creator";
import NavigationList from "./chat-navigation-item";

export default async function ChatNavigation() {
  const chats = await getChatsCached();

  return (
    <ChatNavigationHide>
      <ChatNavigationHeader />
      <div
        className="no-scrollbar h-[calc(100vh-8rem)] overflow-auto relative"
        data-testid="cy-chat-nav"
      >
        {chats.length === 0 && <NoChats />}
        <NavigationList />
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
      <ChatCreator />
    </div>
  );
}
