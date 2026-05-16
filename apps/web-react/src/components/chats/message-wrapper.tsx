import { useAppContext } from "@/contexts/app-provider";
import { useChatFooterContext } from "@/contexts/chat-footer-provider";
import { useChatContext } from "@/contexts/chat-provider";
import { queryKeys } from "@/lib/query-keys";
import { socketClient } from "@/lib/socket-client";
import { ChatService } from "@/services/chat.service";
import { Message as MessageType } from "@packages/schemas";
import { Message } from "@packages/ui/components/features/chats/message";
import { MessageControls } from "@packages/ui/components/features/chats/message-controls";
import { ReactionCreator } from "@packages/ui/components/features/chats/reaction-creator";
import { useQueryClient } from "react-query";

export function MessageWrapper({ message }: { message: MessageType }) {
	const { user: me } = useAppContext();
	const { messages, messageRefs, chat } = useChatContext();

	if (!me || !messages || !chat) throw new Error();

	return (
		<Message
			message={message}
			me={me}
			chat={chat}
			messages={messages}
			messageRef={(el) => (messageRefs.current[message.id] = el)}
			messageControls={<MessageControlsWrapper message={message} />}
			onScrollToMessage={(id) => messageRefs.current[id]?.scrollIntoView({ behavior: "smooth" })}
		/>
	);
}

function MessageControlsWrapper({ message }: { message: MessageType }) {
	const { setIncomeMessageId, addReaction } = useChatContext();
	const { setResponse } = useChatFooterContext();
	const { user: me } = useAppContext();
	const queryClient = useQueryClient();

	return (
		<MessageControls
			onReply={() => setResponse(message.id)}
			slots={{
				reactionCreator: (
					<ReactionCreator
						alreadyReacted={message.reactions.some((r) => r.user.id === me!.id)}
						availableReactions={queryClient.getQueryData(queryKeys.reactions()) ?? null}
						onReact={async (reactionId) => {
							const reaction = await ChatService.createReaction(
								message.id,
								reactionId,
								message.chatId,
							);
							setIncomeMessageId(null);
							addReaction(reaction);
							socketClient.sendReaction(reaction, message.chatId);
						}}
					/>
				),
			}}
		/>
	);
}
