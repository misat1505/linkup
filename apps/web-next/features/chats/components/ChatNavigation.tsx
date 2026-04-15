import NoChats from "./NoChats";
import { ChatNavigationHide } from "./ChatNavigationHide";
import { getChatsCached } from "../actions/getChats";
import { I18nText } from "@/components/shared/I18nText";
import ChatCreator from "./chatCreationDialog/ChatCreator";
import NavigationList from "./ChatNavigationItem";

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
