import Tooltip from "@/components/shared/Tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoIosAddCircleOutline } from "react-icons/io";
import PrivateChatForm from "./PrivateChatForm";
import GroupChatForm from "./GroupChatForm";
import { I18nText } from "@/components/shared/I18nText";
import GroupChatFormProvider from "../../providers/GroupChatFormProvider";
import { CreateChatButton } from "../CreateChatTrigger";

export default function ChatCreator() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Tooltip
            content={
              <I18nText translationKey="chats.create-new-chat.trigger.tooltip" />
            }
          >
            <CreateChatButton>
              <IoIosAddCircleOutline
                size={20}
                className="text-black transition-all hover:scale-125 hover:cursor-pointer dark:text-white md:text-white dark:md:text-black"
              />
            </CreateChatButton>
          </Tooltip>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-200">
        <DialogHeader>
          <DialogTitle>
            <I18nText translationKey="chats.create-new-chat.dialog.title" />
          </DialogTitle>
          <DialogDescription>
            <I18nText translationKey="chats.create-new-chat.dialog.description" />
          </DialogDescription>
        </DialogHeader>
        <ChatCreatorDialogContent />
      </DialogContent>
    </Dialog>
  );
}

function ChatCreatorDialogContent() {
  return (
    <Tabs defaultValue="private" className="h-125">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="private">
          <I18nText translationKey="chats.create-new-chat.tabs.private" />
        </TabsTrigger>
        <TabsTrigger value="group">
          <I18nText translationKey="chats.create-new-chat.tabs.group" />
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
