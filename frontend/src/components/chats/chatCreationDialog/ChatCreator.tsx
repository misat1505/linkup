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

export default function ChatCreator() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <IoIosAddCircleOutline
            size={20}
            className="transition-all hover:scale-125 hover:cursor-pointer"
          />
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
