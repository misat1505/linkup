"use client";

import { ChatCreator } from "@packages/ui/components/features/chats/chat-creation-dialog/chat-creator";
import GroupChatFormProvider from "../providers/group-chat-form-provider";
import GroupChatForm from "./chat-creation-dialog/group-chat-form";
import PrivateChatForm from "./chat-creation-dialog/private-chat-form";
import { CreateChatTarget } from "./create-chat-trigger";

export default function ChatCreatorWrapper() {
  return (
    <ChatCreator
      slots={{
        createChatTarget: CreateChatTarget,
        groupChatForm: (
          <GroupChatFormProvider>
            <GroupChatForm />
          </GroupChatFormProvider>
        ),
        privateChatForm: <PrivateChatForm />,
      }}
    />
  );
}
