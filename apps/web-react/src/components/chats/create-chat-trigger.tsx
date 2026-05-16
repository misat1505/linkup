"use client";

import { useChatPageContext } from "@/contexts/chat-page-provider";
import { Button } from "@packages/ui/components/shadcn/button";
import { PropsWithChildren } from "react";

export function Trigger({ children }: PropsWithChildren) {
	const { createChatTriggerRef } = useChatPageContext();

	return (
		<Button onClick={() => createChatTriggerRef.current!.click()} className="mt-4 mx-auto">
			{children}
		</Button>
	);
}

type CreateChatTargetProps = PropsWithChildren;

export function CreateChatTarget({ children }: CreateChatTargetProps) {
	const { createChatTriggerRef } = useChatPageContext();

	return <div ref={createChatTriggerRef}>{children}</div>;
}
