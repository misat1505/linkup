import { RiReplyFill } from "react-icons/ri";
import { TRANSLATION_COMPONENT } from "../../../config";
import {
	TooltipContent,
	TooltipProvider,
	TooltipShadcn,
	TooltipTrigger,
} from "../../shadcn/tooltip";

export type MessageControlsProps = {
	onReply: () => void;
	slots: { reactionCreator: React.ReactNode };
};

export function MessageControls({ onReply, slots }: MessageControlsProps) {
	return (
		<div className="hidden group-hover:block">
			<div className="flex items-center gap-x-2">
				<TooltipProvider>
					<TooltipShadcn>
						<TooltipTrigger>
							<RiReplyFill
								size={20}
								className="text-muted-foreground transition-all hover:cursor-pointer hover:text-slate-400"
								onClick={onReply}
							/>
						</TooltipTrigger>
						<TooltipContent>
							<TRANSLATION_COMPONENT translationKey="chats.message.controls.reply.tooltip" />
						</TooltipContent>
					</TooltipShadcn>
				</TooltipProvider>
				{slots.reactionCreator}
			</div>
		</div>
	);
}

// import { Message } from "@packages/schemas";
// import { useQueryClient } from "@tanstack/react-query";
// import { MessageControls } from "@packages/ui";
// import { ReactionCreator } from "@packages/ui";
// import { useChatFooterContext } from "../providers/chat-footer-provider";
// import { useAppContext } from "../../../context";
// import { queryKeys } from "../../../queryKeys";
// import { createReaction } from "../../../api";
//
// export function MessageControlsContainer({ message }: { message: Message }) {
//   const { setResponse } = useChatFooterContext();
//   const { user: me } = useAppContext();
//   const queryClient = useQueryClient();

//   return (
//     <MessageControls
//       onReply={() => setResponse(message.id)}
//       slots={{
//         reactionCreator: (
//           <ReactionCreator
//             alreadyReacted={message.reactions.some((r) => r.user.id === me!.id)}
//             availableReactions={
//               queryClient.getQueryData(queryKeys.reactions()) ?? null
//             }
//             onReact={async (reactionId) => {
//               const reaction = await createReaction(
//                 message.id,
//                 reactionId,
//                 chat.id,
//               );
//               socketClient.sendReaction(reaction, chat.id);
//             }}
//           />
//         ),
//       }}
//     />
//   );
// }
