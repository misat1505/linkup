import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "../../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import GroupChatFormProvider from "../../../contexts/GroupChatFormProvider";
import PrivateChatForm from "./PrivateChatForm";
import GroupChatForm from "./GroupChatForm";
import Tooltip from "../../common/Tooltip";
import { useChatPageContext } from "../../../contexts/ChatPageProvider";

export default function ChatCreator() {
  const { createChatTriggerRef } = useChatPageContext();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <Tooltip content="Create chat">
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
          <DialogTitle>Create new chat</DialogTitle>
          <DialogDescription>
            Search and invite other users to your newly created chat. Click on
            the user to invite him to the chat.
          </DialogDescription>
        </DialogHeader>
        <ChatCreatorDialogContent />
      </DialogContent>
    </Dialog>
  );
}

function ChatCreatorDialogContent() {
  return (
    <Tabs defaultValue="private" className="h-[500px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="private">Private</TabsTrigger>
        <TabsTrigger value="group">Group</TabsTrigger>
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
