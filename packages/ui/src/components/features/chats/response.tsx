import { Message } from "@packages/schemas";
import { TRANSLATION_COMPONENT, useUiPackageContext } from "../../../config";
import { createFullName } from "../../../utils/create-full-name";

export type ResponseProps = {
	message: Message["response"];
	isMe: boolean;
	onScrollTo: () => void;
};

export function Response({ message, isMe, onScrollTo }: ResponseProps) {
	const { t } = useUiPackageContext();

	if (!message) throw new Error("Message is required in Response component");

	const getText = () => {
		if (message.content) return message.content.substring(0, 20);

		return (
			<TRANSLATION_COMPONENT
				translationKey="chats.message.reply.only-files"
				values={{
					name: isMe ? t("common.you") : createFullName(message.author),
					count: String(message.files.length),
				}}
			/>
		);
	};

	return (
		<div
			onClick={onScrollTo}
			className="w-fit rounded-md bg-black p-2 text-muted-foreground shadow-lg transition-all hover:cursor-pointer hover:text-slate-400"
			style={{ boxShadow: "0 10px black" }}
		>
			{getText()}
		</div>
	);
}

// import { Message } from "@packages/schemas";
// import { useAppContext } from "../../../context";
// import { useChatContext } from "../providers/chat-provider";
// import { Response } from "@packages/ui";

// export function ResponseContainer({ message }: { message: Message["response"] }) {
//   const { user: me } = useAppContext();
//   const { messageRefs } = useChatContext();

//   return (
//     <Response
//       message={message}
//       isMe={me!.id === message?.author.id}
//       onScrollTo={() => {
//         messageRefs.current[message!.id]?.scrollIntoView({ behavior: "smooth" });
//       }}
//     />
//   );
// }
