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
import { useTranslation } from "react-i18next";

export default function ChatSettingsDialog() {
  const { t } = useTranslation();
  const { chat } = useChatContext();

  return (
    <Dialog>
      <DialogTrigger asChild className="aspect-square h-5 w-5">
        <span>
          <Tooltip content={t("chats.settings.trigger.tooltip")}>
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
          <DialogTitle>{t("chats.settings.title")}</DialogTitle>
          <DialogDescription>
            {chat?.type === "PRIVATE"
              ? t("chats.settings.description.private")
              : t("chats.settings.description.group")}
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
