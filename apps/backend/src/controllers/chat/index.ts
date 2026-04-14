import { addUserToGroupChatController } from "./addUserToGroupChat.controller";
import { createGroupChatController } from "./createGroupChat.controller";
import { createMessageController } from "./createMessage.controller";
import { createPrivateChatController } from "./createPrivateChat.controller";
import { createReactionController } from "./createReaction.controller";
import { deleteSelfFromGroupChatController } from "./deleteSelfFromGroupChat.controller";
import { getChatMessagesController } from "./getChatMessages.controller";
import { getSelfChatsController } from "./getSelfChats.controller";
import { updateGroupChatController } from "./updateGroupChat.controller";
import { updateAliasController } from "./updateUserAlias.controller";

export namespace ChatControllers {
  export const addUserToGroupChat = addUserToGroupChatController;
  export const createGroupChat = createGroupChatController;
  export const createMessage = createMessageController;
  export const createPrivateChat = createPrivateChatController;
  export const createReaction = createReactionController;
  export const deleteSelfFromGroupChat = deleteSelfFromGroupChatController;
  export const getChatMessages = getChatMessagesController;
  export const getSelfChats = getSelfChatsController;
  export const updateGroupChat = updateGroupChatController;
  export const updateAlias = updateAliasController;
}
