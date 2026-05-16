import { TRANSLATION_COMPONENT } from "../../../config";

export function NoChats() {
	return (
		<p className="text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm">
			<TRANSLATION_COMPONENT translationKey="chats.no-chats" />
		</p>
	);
}
