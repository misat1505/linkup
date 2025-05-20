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
