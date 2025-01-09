import Tooltip from "@/components/common/Tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useChatContext } from "@/contexts/ChatProvider";
import { CiSettings } from "react-icons/ci";
import ChatMembersDisplayer from "./ChatMembersDisplayer";
import GroupChatContent from "./GroupChatContent";

export default function ChatSettingsDialog() {
  const { chat } = useChatContext();

  const privateDescription =
    "Manage the members of this chat by viewing who's currently part of the conversation. You can update or remove their aliases as needed.";
  const groupDescription =
    "Manage the members of this chat by viewing who's currently part of the conversation. You can update or remove their aliases as needed. Additionally, you have the option to invite new users to join the chat.";

  return (
    <Dialog>
      <DialogTrigger asChild className="aspect-square h-5 w-5">
        <span>
          <Tooltip content="Settings">
            <button>
              <CiSettings
                size={20}
                className="transition-all hover:scale-125"
              />
            </button>
          </Tooltip>
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            {chat?.type === "PRIVATE" ? privateDescription : groupDescription}
          </DialogDescription>
        </DialogHeader>
        {chat?.type === "PRIVATE" ? (
          <ChatMembersDisplayer />
        ) : (
          <GroupChatContent />
        )}
      </DialogContent>
    </Dialog>
  );
}
