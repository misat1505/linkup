import { queryKeys } from "@/lib/query-keys";
import { socketClient } from "@/lib/socket-client";
import { useAppContext } from "@/providers/app-provider";
import { Message as MessageType } from "@packages/schemas";
import { Message } from "@packages/ui/components/features/chats/message";
import { MessageControls } from "@packages/ui/components/features/chats/message-controls";
import { ReactionCreator } from "@packages/ui/components/features/chats/reaction-creator";
import { useQueryClient } from "@tanstack/react-query";
import { createReaction } from "../actions/create-reaction";
import { useChatFooterContext } from "../providers/chat-footer-provider";
import { useChatContext } from "../providers/chat-provider";

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
			// eslint-disable-next-line react-hooks/immutability
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
							const reaction = await createReaction(message.id, reactionId, message.chatId);
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
