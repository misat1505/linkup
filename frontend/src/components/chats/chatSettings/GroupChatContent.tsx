import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChatInfoUpdater from "./ChatInfoUpdater";
import ChatMembersDisplayer from "./ChatMembersDisplayer";
import UserInvite from "./UserInvite";

export default function GroupChatContent() {
  return (
    <Tabs defaultValue="overrall">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overrall">Overrall</TabsTrigger>
        <TabsTrigger value="members">Members</TabsTrigger>
        <TabsTrigger value="invite">Invite</TabsTrigger>
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
