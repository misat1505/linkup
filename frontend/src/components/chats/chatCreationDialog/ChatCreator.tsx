import Tooltip from "@/components/common/Tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useChatPageContext } from "@/contexts/ChatPageProvider";
import { IoIosAddCircleOutline } from "react-icons/io";
import PrivateChatForm from "./PrivateChatForm";
import GroupChatFormProvider from "@/contexts/GroupChatFormProvider";
import GroupChatForm from "./GroupChatForm";
import { useTranslation } from "react-i18next";

export default function ChatCreator() {
  const { t } = useTranslation();
  const { createChatTriggerRef } = useChatPageContext();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Tooltip content={t("chats.create-new-chat.trigger.tooltip")}>
            <div ref={createChatTriggerRef}>
              <IoIosAddCircleOutline
                size={20}
                className="text-black transition-all hover:scale-125 hover:cursor-pointer dark:text-white md:text-white dark:md:text-black"
              />
            </div>
          </Tooltip>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{t("chats.create-new-chat.dialog.title")}</DialogTitle>
          <DialogDescription>
            {t("chats.create-new-chat.dialog.description")}
          </DialogDescription>
        </DialogHeader>
        <ChatCreatorDialogContent />
      </DialogContent>
    </Dialog>
  );
}

function ChatCreatorDialogContent() {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="private" className="h-[500px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="private">
          {t("chats.create-new-chat.tabs.private")}
        </TabsTrigger>
        <TabsTrigger value="group">
          {t("chats.create-new-chat.tabs.group")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="private">
        <PrivateChatForm />
      </TabsContent>
      <TabsContent value="group">
        <GroupChatFormProvider>
          <GroupChatForm />
        </GroupChatFormProvider>
      </TabsContent>
    </Tabs>
  );
}
