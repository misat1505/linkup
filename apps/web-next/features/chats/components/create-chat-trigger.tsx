"use client";

import { Button } from "@/components/ui/button";
import { PropsWithChildren } from "react";
import { useChatPageContext } from "../providers/chat-page-provider";

type CreateChatTriggerProps = PropsWithChildren;

export function CreateChatTrigger({ children }: CreateChatTriggerProps) {
  const { createChatTriggerRef } = useChatPageContext();

  return (
    <Button
      onClick={() => createChatTriggerRef.current!.click()}
      className="mt-4 mx-auto"
    >
      {children}
    </Button>
  );
}

type CreateChatTargetProps = PropsWithChildren;

export function CreateChatTarget({ children }: CreateChatTargetProps) {
  const { createChatTriggerRef } = useChatPageContext();

  return <div ref={createChatTriggerRef}>{children}</div>;
}
