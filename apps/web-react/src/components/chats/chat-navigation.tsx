import { useAppContext } from "@/contexts/app-provider";
import { useChatPageContext } from "@/contexts/chat-page-provider";
import GroupChatFormProvider from "@/contexts/group-chat-form-provider";
import { cn } from "@/lib/utils";
import { ChatCreator } from "@packages/ui/components/features/chats/chat-creation-dialog/chat-creator";
import { NavigationList } from "@packages/ui/components/features/chats/chat-navigation-list";
import { NoChats } from "@packages/ui/components/features/chats/no-chats";
import { Loading } from "@packages/ui/components/misc/loading";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import GroupChatForm from "./chat-creation-dialog/group-chat-form";
import PrivateChatForm from "./chat-creation-dialog/private-chat-form";
import { CreateChatTarget } from "./create-chat-trigger";

export default function ChatNavigation() {
  const { user: me } = useAppContext();
  const { chatId } = useParams();
  const { chats, isLoading } = useChatPageContext();

  const classnames = cn("w-full md:w-80", { "hidden md:block": !!chatId });

  if (isLoading)
    return (
      <div className={cn(classnames, "relative")}>
        <Loading />
      </div>
    );

  return (
    <div className={classnames}>
      <ChatNavigationHeader />
      <div
        className="no-scrollbar h-[calc(100vh-8rem)] overflow-auto relative"
        data-testid="cy-chat-nav"
      >
        {chats?.length === 0 ? (
          <NoChats />
        ) : (
          <NavigationList chats={chats!} me={me!} />
        )}
      </div>
    </div>
  );
}

function ChatNavigationHeader() {
  const { t } = useTranslation();

  return (
    <div className="flex w-full items-center justify-between bg-transparent px-4 py-2 text-white">
      <h2 className="text-lg font-semibold">{t("chats.navigation.title")}</h2>
      <ChatCreator
        slots={{
          createChatTarget: CreateChatTarget,
          groupChatForm: (
            <GroupChatFormProvider>
              <GroupChatForm />
            </GroupChatFormProvider>
          ),
          privateChatForm: <PrivateChatForm />,
        }}
      />
    </div>
  );
}
