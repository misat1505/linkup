import { IoIosAddCircleOutline } from "react-icons/io";
import { TRANSLATION_COMPONENT } from "../../../../config";
import { Tooltip } from "../../../misc/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../shadcn/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../shadcn/tabs";

type ChatCreatorProps = {
  slots: ChatCreatorDialogContentProps["slots"] & {
    createChatTarget: React.ComponentType<{ children: React.ReactNode }>;
  };
};

export function ChatCreator(props: ChatCreatorProps) {
  const Target = props.slots.createChatTarget;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Tooltip
            content={
              <TRANSLATION_COMPONENT translationKey="chats.create-new-chat.trigger.tooltip" />
            }
          >
            <Target>
              <IoIosAddCircleOutline
                size={20}
                className="text-black transition-all hover:scale-125 hover:cursor-pointer dark:text-white md:text-white dark:md:text-black"
              />
            </Target>
          </Tooltip>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-200!">
        <DialogHeader>
          <DialogTitle>
            <TRANSLATION_COMPONENT translationKey="chats.create-new-chat.dialog.title" />
          </DialogTitle>
          <DialogDescription>
            <TRANSLATION_COMPONENT translationKey="chats.create-new-chat.dialog.description" />
          </DialogDescription>
        </DialogHeader>
        <ChatCreatorDialogContent {...props} />
      </DialogContent>
    </Dialog>
  );
}

type ChatCreatorDialogContentProps = {
  slots: {
    privateChatForm: React.ReactNode;
    groupChatForm: React.ReactNode;
  };
};

function ChatCreatorDialogContent({ slots }: ChatCreatorDialogContentProps) {
  return (
    <Tabs defaultValue="private" className="h-125">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="private">
          <TRANSLATION_COMPONENT translationKey="chats.create-new-chat.tabs.private" />
        </TabsTrigger>
        <TabsTrigger value="group">
          <TRANSLATION_COMPONENT translationKey="chats.create-new-chat.tabs.group" />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="private">{slots.privateChatForm}</TabsContent>
      <TabsContent value="group">{slots.groupChatForm}</TabsContent>
    </Tabs>
  );
}
