"use client";

import { I18nText } from "@/components/i18n-text";
import { useAppContext } from "@/providers/app-provider";
import { Chat } from "@packages/schemas";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@packages/ui/components/shadcn/tabs";
import ChatInfoUpdater from "./chat-info-updater";
import ChatMembersDisplayer from "./chat-members-displayer";
import UserInvite from "./user-invite";

type GroupChatContentProps = {
  chat: Chat;
};

export default function GroupChatContent({ chat }: GroupChatContentProps) {
  const { user: me } = useAppContext();

  return (
    <Tabs defaultValue="overrall">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overrall">
          <I18nText translationKey="chats.settings.group.tabs.general" />
        </TabsTrigger>
        <TabsTrigger value="members">
          <I18nText translationKey="chats.settings.group.tabs.members" />
        </TabsTrigger>
        <TabsTrigger value="invite">
          <I18nText translationKey="chats.settings.group.tabs.invite" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overrall">
        <ChatInfoUpdater chat={chat} />
      </TabsContent>
      <TabsContent value="members">
        <ChatMembersDisplayer chat={chat} me={me!} />
      </TabsContent>
      <TabsContent value="invite">
        <UserInvite chat={chat} />
      </TabsContent>
    </Tabs>
  );
}
