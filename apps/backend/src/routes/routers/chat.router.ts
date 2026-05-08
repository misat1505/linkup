import { ChatControllers } from "@/controllers";
import { upload } from "@/middlewares/multer";
import { buildProtectedRoute, buildRouter } from "@/utils/build-router";
import { API_CONTRACT } from "@packages/api-contract";

/**
 * Chat Routes Router.
 *
 * This router handles all chat-related operations including creating private and group chats,
 * sending messages, adding reactions, updating user aliases, and managing group chat users.
 * All routes are protected and require authorization, with file uploads supported for certain endpoints.
 */
const routes = [
  buildProtectedRoute(
    API_CONTRACT.CREATE_PRIVATE_CHAT,
    ChatControllers.createPrivateChat,
  ),
  buildProtectedRoute(
    API_CONTRACT.CREATE_GROUP_CHAT,
    ChatControllers.createGroupChat,
    { extraMiddlewares: [upload.single("file")] },
  ),
  buildProtectedRoute(
    API_CONTRACT.GET_SELF_CHATS,
    ChatControllers.getSelfChats,
  ),
  buildProtectedRoute(
    API_CONTRACT.CREATE_MESSAGE,
    ChatControllers.createMessage,
    { extraMiddlewares: [upload.array("files")] },
  ),
  buildProtectedRoute(
    API_CONTRACT.GET_CHAT_MESSAGES,
    ChatControllers.getChatMessages,
  ),
  buildProtectedRoute(
    API_CONTRACT.CREATE_REACTION,
    ChatControllers.createReaction,
  ),
  buildProtectedRoute(
    API_CONTRACT.UDPATE_USER_ALIAS,
    ChatControllers.updateAlias,
  ),
  buildProtectedRoute(
    API_CONTRACT.ADD_USER_TO_GROUP_CHAT,
    ChatControllers.addUserToGroupChat,
  ),
  buildProtectedRoute(
    API_CONTRACT.DELETE_SELF_FROM_GROUP_CHAT,
    ChatControllers.deleteSelfFromGroupChat,
  ),
  buildProtectedRoute(
    API_CONTRACT.UPDATE_GROUP_CHAT,
    ChatControllers.updateGroupChat,
    { extraMiddlewares: [upload.single("file")] },
  ),
];

export default buildRouter(routes);
