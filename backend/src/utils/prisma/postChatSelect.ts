import { Chat } from "../../types/Chat";

/**
 * Prisma select object for querying basic information about a chat.
 * This select object includes the chat's ID, creation date, and type.
 *
 * This utility simplifies the process of selecting only the necessary fields for a chat.
 *
 * @source
 *
 * @constant
 * @example
 * const chats = await prisma.chat.findMany({
 *   select: postChatSelect
 * });
 */
export const postChatSelect = {
  id: true,
  createdAt: true,
  type: true,
} as const;

/**
 * Transforms a selected chat object into a full `Chat` object.
 * The provided selected chat includes only the basic fields (`id`, `createdAt`, `type`),
 * and the function fills in the remaining fields (`name`, `photoURL`, `users`, `lastMessage`)
 * with `null` values as placeholders.
 *
 * @param selectedChat - An object containing the selected chat's basic fields.
 * @returns A `Chat` object with the basic fields and `null` values for the additional fields.
 *
 * @source
 *
 * @example
 * const transformedChat = transformPostChatSelect({
 *   id: "1",
 *   createdAt: new Date(),
 *   type: "group"
 * });
 */
export function transformPostChatSelect(selectedChat: {
  id: Chat["id"];
  createdAt: Chat["createdAt"];
  type: Chat["type"];
}): Chat {
  const chat: Chat = {
    id: selectedChat.id,
    createdAt: selectedChat.createdAt,
    type: selectedChat.type,
    name: null,
    photoURL: null,
    users: null,
    lastMessage: null,
  };

  return chat;
}
