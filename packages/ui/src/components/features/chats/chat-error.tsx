"use client";

import { BsChatLeftTextFill } from "react-icons/bs";
import { LINK_COMPONENT, TRANSLATION_COMPONENT } from "../../../config";
import { cn } from "../../../lib/utils";
import { buttonVariants } from "../../shadcn/button";

export function ChatError() {
	return (
		<div className="relative flex-grow">
			<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-100 p-8 text-center dark:bg-slate-900 shadow-lg">
				<BsChatLeftTextFill className="mx-auto h-64 w-64 text-red-500" />
				<h2 className="my-4 text-center text-xl font-semibold">
					<TRANSLATION_COMPONENT translationKey="chats.chat-unavailable.title" />
				</h2>
				<p className="max-w-64 text-left text-muted-foreground text-sm">
					<TRANSLATION_COMPONENT translationKey="chats.chat-unavailable.description" />
				</p>
				<LINK_COMPONENT
					className={cn("mx-auto mt-4", buttonVariants({ variant: "default" }))}
					href="/chats"
				>
					<TRANSLATION_COMPONENT translationKey="chats.chat-unavailable.action" />
				</LINK_COMPONENT>
			</div>
		</div>
	);
}
