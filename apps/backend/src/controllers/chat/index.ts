import { addUserToGroupChatController } from "./add-user-to-group-chat.controller";
import { createGroupChatController } from "./create-group-chat.controller";
import { createMessageController } from "./create-message.controller";
import { createPrivateChatController } from "./create-private-chat.controller";
import { createReactionController } from "./create-reaction.controller";
import { deleteSelfFromGroupChatController } from "./delete-self-from-group-chat.controller";
import { getChatMessagesController } from "./get-chat-messages.controller";
import { getSelfChatsController } from "./get-self-chats.controller";
import { updateGroupChatController } from "./update-group-chat.controller";
import { updateAliasController } from "./update-user-alias.controller";

export const ChatControllers = {
	addUserToGroupChat: addUserToGroupChatController,
	createGroupChat: createGroupChatController,
	createMessage: createMessageController,
	createPrivateChat: createPrivateChatController,
	createReaction: createReactionController,
	deleteSelfFromGroupChat: deleteSelfFromGroupChatController,
	getChatMessages: getChatMessagesController,
	getSelfChats: getSelfChatsController,
	updateGroupChat: updateGroupChatController,
	updateAlias: updateAliasController,
};
