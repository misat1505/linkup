import { I18nText } from "@/components/i18n-text";
import { Chat, User } from "@packages/schemas";
import { Tooltip } from "@packages/ui/components/misc/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@packages/ui/components/shadcn/dialog";
import { CiSettings } from "react-icons/ci";
import ChatMembersDisplayer from "./chat-members-displayer";
import GroupChatContent from "./group-chat-content";

type ChatSettingsDialogProps = {
  chat: Chat;
  me: User;
};

export default function ChatSettingsDialog({
  chat,
  me,
}: ChatSettingsDialogProps) {
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
          <ChatMembersDisplayer chat={chat} me={me} />
        ) : (
          <GroupChatContent chat={chat} />
        )}
      </DialogContent>
    </Dialog>
  );
}
