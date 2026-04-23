import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Message } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { response } from "../../utils/responses";

const querySchema = z
  .object({
    responseId: z.string().optional(),
    lastMessageId: z.string().optional(),
    limit: z.coerce.number().min(1).max(20).optional(),
  })
  .superRefine((data, ctx) => {
    const hasResponseId = !!data.responseId;
    const hasPagination = !!data.lastMessageId && data.limit !== undefined;

    if (!hasResponseId && !hasPagination) {
      ctx.addIssue({
        code: "custom",
        message:
          "You must provide either responseId or lastMessageId with limit.",
      });
      return;
    }

    if (!hasResponseId) {
      if (!data.lastMessageId) {
        ctx.addIssue({
          code: "custom",
          message: "lastMessageId is required when using pagination.",
          path: ["lastMessageId"],
        });
      }

      if (data.limit === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "limit is required when using pagination.",
          path: ["limit"],
        });
      }
    }
  });

export const getChatMessagesRoute = {
  method: "get",
  path: "/chats/{chatId}/messages",
  summary: "Get messages from a chat",
  tags: [TAGS.CHATS],

  request: {
    params: z.object({
      chatId: z.string(),
    }),

    query: querySchema,
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
