import { getMessages } from "@/features/chats/actions/get-messages";
import { queryKeys } from "@/lib/query-keys";
import { useAppContext } from "@/providers/app-provider";
import { Message } from "@packages/schemas";
import {
	CommentSectionOpenButton,
	PostCommentSectionLayout,
	ResponseSetButton,
	ToggleSubsectionOpenButton,
} from "@packages/ui/components/features/posts/post-comment-section";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { usePostCommentsSectionContext } from "../providers/post-comment-section-provider";
import PostCommentForm from "./post-comment-form";

export default function PostCommentSection() {
	const { user: me } = useAppContext();
	const { isCommentSectionOpen, toggleIsCommentSectionOpen } = usePostCommentsSectionContext();

	return (
		<div>
			<CommentSectionOpenButton
				isCommentSectionOpen={isCommentSectionOpen}
				toggleIsCommentSectionOpen={toggleIsCommentSectionOpen}
				me={me ?? undefined}
			/>
			{isCommentSectionOpen && (
				<div>
					<CommentSection group={null} level={1} />
					<PostCommentForm />
				</div>
			)}
		</div>
	);
}

function CommentSection({ group, level }: { group: string | null; level: number }) {
	const { chat, setResponse } = usePostCommentsSectionContext();
	const { user: me } = useAppContext();
	const { data: messages = [] } = useQuery({
		queryKey: queryKeys.messages(chat.id, group),
		queryFn: () => getMessages(chat.id, group),
		refetchOnMount: false,
	});

	const [activeMessages, setActiveMessages] = useState<Message["id"][]>([]);

	const toggleIsMessageActive = (id: Message["id"]) => {
		setActiveMessages((prevMessages) => {
			if (prevMessages.includes(id)) return prevMessages.filter((m) => m !== id);
			return [...prevMessages, id];
		});
	};

	return (
		<>
			{messages.map((message) => (
				<React.Fragment key={message.id}>
					<PostCommentSectionLayout level={level} me={me!} message={message}>
						<ResponseSetButton
							isActive={activeMessages.includes(message.id)}
							onclick={() => setResponse(message)}
						/>
						<ToggleSubsectionOpenButton
							isActive={activeMessages.includes(message.id)}
							onclick={() => toggleIsMessageActive(message.id)}
						/>
					</PostCommentSectionLayout>
					{activeMessages.includes(message.id) && (
						<CommentSection group={message.id} level={level + 1} />
					)}
				</React.Fragment>
			))}
		</>
	);
}
