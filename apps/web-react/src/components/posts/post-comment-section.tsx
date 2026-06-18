import { useAppContext } from "@/contexts/app-provider";
import { usePostCommentsSectionContext } from "@/contexts/post-comment-section-provider";
import { queryKeys } from "@/lib/query-keys";
import { ChatService } from "@/services/chat.service";
import { Message } from "@packages/schemas";
import {
	CommentSectionOpenButton,
	PostCommentSectionLayout,
	ResponseSetButton,
	ToggleSubsectionOpenButton,
} from "@packages/ui/components/features/posts/post-comment-section";
import React, { useState } from "react";
import { useQuery } from "react-query";
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
		queryFn: () => ChatService.getMessages(chat.id, group),
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
