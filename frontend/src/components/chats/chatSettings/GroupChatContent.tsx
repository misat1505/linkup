import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import React from "react";
import ChatMembersDisplayer from "./ChatMembersDisplayer";
import UserInvite from "./UserInvite";

export default function GroupChatContent() {
  return (
    <Tabs defaultValue="members">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="invite">Invite</TabsTrigger>
      </TabsList>
      <TabsContent value="members">
        <ChatMembersDisplayer />
      </TabsContent>
      <TabsContent value="invite">
        <UserInvite />
      </TabsContent>
    </Tabs>
  );
}
