import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ErrorMessage, Message } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const getChatMessagesRoute = {
  method: "get",
  path: "/chats/{chatId}/messages",
  summary: "Get messages from a chat",
  tags: [TAGS.CHATS],

  request: {
    params: z.object({
      chatId: z.string(),
    }),

    query: z.object({
      responseId: z.string().optional(),
      lastMessageId: z.string().optional(),
      limit: z.coerce.number().min(1).max(10).optional(),
    }),
  },

  responses: {
    [StatusCodes.OK]: {
      description: "Messages retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            messages: z.array(Message),
          }),
        },
      },
    },

    [StatusCodes.FORBIDDEN]: {
      description: "User not authorized to read messages from this chat",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error when fetching messages",
    },
  },
} satisfies RouteConfig;
