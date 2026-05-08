import { GroupChatContent as GccUi } from "@packages/ui/components/features/chats/chat-settings/group-chat-content";
import ChatInfoUpdater from "./chat-info-updater";
import ChatMembersDisplayer from "./chat-members-displayer";
import UserInvite from "./user-invite";

export default function GroupChatContent() {
  return (
    <GccUi
      slots={{
        chatInfoUpdater: <ChatInfoUpdater />,
        chatMembersDisplayer: <ChatMembersDisplayer />,
        userInvite: <UserInvite />,
      }}
    />
  );
}
