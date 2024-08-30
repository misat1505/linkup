import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import React from "react";
import ChatMembersDisplayer from "./ChatMembersDisplayer";
import UserInvite from "./UserInvite";
import ChatInfoUpdater from "./ChatInfoUpdater";

export default function GroupChatContent() {
  return (
    <Tabs defaultValue="members">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="invite">Invite</TabsTrigger>
        <TabsTrigger value="overrall">Overrall</TabsTrigger>
      </TabsList>
      <TabsContent value="members">
        <ChatMembersDisplayer />
      </TabsContent>
      <TabsContent value="invite">
        <UserInvite />
      </TabsContent>
      <TabsContent value="overrall">
        <ChatInfoUpdater />
      </TabsContent>
    </Tabs>
  );
}
