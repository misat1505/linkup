import { userSelect } from "./userSelect";

/**
 * Prisma select object for querying messages without their associated responses.
 * This select object includes fields related to the message, such as content, author,
 * creation date, associated chat, and any files related to the message.
 *
 * This utility is designed to avoid repeating the same select logic across different queries.
 *
 * @source
 *
 * @constant
 * @example
 * const messages = await prisma.message.findMany({
 *   select: messageWithoutResponseSelect
 * });
 */
export const messageWithoutResponseSelect = {
  id: true,
  content: true,
  author: {
    select: userSelect,
  },
  createdAt: true,
  chatId: true,
  files: {
    select: {
      id: true,
      url: true,
    },
  },
} as const;
