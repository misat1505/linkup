import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInfoUpdater from "./ChatInfoUpdater";
import ChatMembersDisplayer from "./ChatMembersDisplayer";
import UserInvite from "./UserInvite";
import { useTranslation } from "react-i18next";

export default function GroupChatContent() {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="overrall">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overrall">
          {t("chats.settings.group.tabs.general")}
        </TabsTrigger>
        <TabsTrigger value="members">
          {t("chats.settings.group.tabs.members")}
        </TabsTrigger>
        <TabsTrigger value="invite">
          {t("chats.settings.group.tabs.invite")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overrall">
        <ChatInfoUpdater />
      </TabsContent>
      <TabsContent value="members">
        <ChatMembersDisplayer />
      </TabsContent>
      <TabsContent value="invite">
        <UserInvite />
      </TabsContent>
    </Tabs>
  );
}
