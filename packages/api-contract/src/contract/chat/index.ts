import { addUserToGroupChatRoute } from "./add-user-to-group-chat";
import { createGroupChatRoute } from "./create-group-chat";
import { createMessageRoute } from "./create-message";
import { createPrivateChatRoute } from "./create-private-chat";
import { createReactionRoute } from "./create-reaction";
import { deleteSelfFromGroupChatRoute } from "./delete-self-from-group-chat";
import { getChatMessagesRoute } from "./get-chat-messages";
import { getSelfChatsRoute } from "./get-self-chats";
import { updateAliasRoute } from "./update-user-alias";

export const chatsContract = {
  ADD_USER_TO_GROUP_CHAT: addUserToGroupChatRoute,
  CREATE_GROUP_CHAT: createGroupChatRoute,
  CREATE_MESSAGE: createMessageRoute,
  CREATE_PRIVATE_CHAT: createPrivateChatRoute,
  CREATE_REACTION: createReactionRoute,
  DELETE_SELF_FROM_GROUP_CHAT: deleteSelfFromGroupChatRoute,
  GET_CHAT_MESSAGES: getChatMessagesRoute,
  GET_SELF_CHATS: getSelfChatsRoute,
  UPDATE_GROUP_CHAT: updateAliasRoute,
  UDPATE_USER_ALIAS: updateAliasRoute,
};
