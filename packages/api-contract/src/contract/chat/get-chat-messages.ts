import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Message } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { response } from "../../utils/responses";

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
    [StatusCodes.OK]: response.json({
      schema: z.object({
        messages: z.array(Message),
      }),
      description: "Messages retrieved successfully",
    }),

    [StatusCodes.FORBIDDEN]: errors.forbidden({
      description: "User not authorized to read messages from this chat",
    }),
  },
} satisfies RouteConfig;
