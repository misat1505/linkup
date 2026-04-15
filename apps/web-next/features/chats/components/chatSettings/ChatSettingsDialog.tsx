import Tooltip from "@/components/shared/Tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CiSettings } from "react-icons/ci";
import ChatMembersDisplayer from "./ChatMembersDisplayer";
import GroupChatContent from "./GroupChatContent";
import { Chat } from "../../schemas/chat";
import { I18nText } from "@/components/shared/I18nText";

type ChatSettingsDialogProps = {
  chat: Chat;
};

export default function ChatSettingsDialog({ chat }: ChatSettingsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild className="aspect-square h-5 w-5">
        <span>
          <Tooltip
            content={
              <I18nText translationKey="chats.settings.trigger.tooltip" />
            }
          >
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
          <DialogTitle>
            <I18nText translationKey="chats.settings.title" />
          </DialogTitle>
          <DialogDescription>
            {chat.type === "PRIVATE" ? (
              <I18nText translationKey="chats.settings.description.private" />
            ) : (
              <I18nText translationKey="chats.settings.description.group" />
            )}
          </DialogDescription>
        </DialogHeader>
        {chat.type === "PRIVATE" ? (
          <ChatMembersDisplayer chat={chat} />
        ) : (
          <GroupChatContent chat={chat} />
        )}
      </DialogContent>
    </Dialog>
  );
}
