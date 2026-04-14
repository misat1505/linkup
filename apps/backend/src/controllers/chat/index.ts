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
