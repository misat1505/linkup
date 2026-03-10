"use client";

import { I18nText } from "@/components/shared/I18nText";
import { Button } from "@/components/ui/button";
import { useChatPageContext } from "../providers/ChatPageProvider";
import { PropsWithChildren } from "react";

export function CreateChatTrigger() {
  const { createChatTriggerRef } = useChatPageContext();

  return (
    <Button
      onClick={() => createChatTriggerRef.current!.click()}
      className="mt-4 mx-auto"
    >
      <I18nText translationKey="chats.no-chat-selected.action" />
    </Button>
  );
}

type CreateChatButtonProps = PropsWithChildren;

export function CreateChatButton({ children }: CreateChatButtonProps) {
  const { createChatTriggerRef } = useChatPageContext();

  return <div ref={createChatTriggerRef}>{children}</div>;
}
