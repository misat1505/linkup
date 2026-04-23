import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { CreateMessageDTO, Message } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const createMessageRoute = {
  method: "post",
  path: "/chats/{chatId}/messages",
  summary: "Create a new message in a chat",
  tags: [TAGS.CHATS],

  request: {
    params: z.object({
      chatId: z.string(),
    }),

    body: request.multipart({
      schema: CreateMessageDTO,
    }),
  },

  responses: {
    [StatusCodes.CREATED]: response.json({
      schema: z.object({
        message: Message,
      }),
      description: "Message created successfully",
    }),

    [StatusCodes.FORBIDDEN]: errors.forbidden({
      description: "User not authorized to send a message",
    }),

    [StatusCodes.BAD_REQUEST]: errors.badRequest({
      description: "Invalid message payload or chat state",
    }),
  },
} satisfies RouteConfig;
