"use client";
import AuthGuard from "@/components/auth-guard";
import { ChatError as ChatErrorPackage } from "@packages/ui/components/features/chats/chat-error";

export default function ChatError() {
	return (
		<AuthGuard>
			<ChatErrorPackage />
		</AuthGuard>
	);
}
