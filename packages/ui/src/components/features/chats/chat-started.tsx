import { Chat, User } from "@packages/schemas";
import { FaUserGroup } from "react-icons/fa6";
import { TRANSLATION_COMPONENT, useUiPackageContext } from "../../../config";
import { buildFileURL, Filter } from "../../../utils/build-file-url";
import { ChatUtils } from "../../../utils/chat-utils";
import { Image } from "../../misc/image";

type ChatStartedProps = {
	me: User;
	chat: Chat;
};

export function ChatStarted({ me, chat }: ChatStartedProps) {
	const { t } = useUiPackageContext();

	const utils = new ChatUtils(chat!, me!);

	const src = utils.getImageURL()!;
	const alt =
		chat!.type === "PRIVATE" ? (
			utils.getImageAlt()
		) : (
			<FaUserGroup className="object-fit h-[90%] w-[90%] pt-8 mt-4" />
		);
	const chatName = utils.getChatName();

	const buildFilter = (): Filter => {
		if (chat!.type === "PRIVATE") return { type: "avatar" };
		return { type: "chat-photo", id: chat!.id };
	};

	return (
		<div className="flex flex-col items-center mt-12 mb-16">
			<Image
				src={buildFileURL(src, buildFilter())}
				errorContent={alt}
				className={{
					common: "h-40 w-40 mb-4 rounded-full",
					error: "text-6xl font-semibold bg-white dark:bg-black overflow-hidden",
				}}
			/>
			<h2 className="font-bold text-2xl mb-4">{chatName}</h2>
			<p className="text-muted-foreground mb-2 font-bold text-balance text-center">
				<TRANSLATION_COMPONENT
					translationKey="chats.chat-start.created-at"
					values={{
						date: chat?.createdAt.toLocaleDateString(
							t("chats.date-seperator.locale"),
							JSON.parse(t("chats.date-seperator.options.message-tooltip")),
						),
					}}
				/>
			</p>
			<p className="text-sm text-muted-foreground text-balance text-center">
				<TRANSLATION_COMPONENT translationKey="chats.chat-start.greeting" />
			</p>
		</div>
	);
}
