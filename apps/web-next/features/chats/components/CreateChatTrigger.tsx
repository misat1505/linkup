"use client";

import { Button } from "@/components/ui/button";
import { useChatPageContext } from "../providers/ChatPageProvider";
import { PropsWithChildren } from "react";

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
