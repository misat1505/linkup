import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Chat, CreateReactionDTO, Reaction } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const createReactionRoute = {
  method: "post",
  path: "/chats/{chatId}/reactions",
  summary: "Create a reaction to a message in a chat",
  tags: [TAGS.CHATS],

  request: {
    params: z.object({
      chatId: Chat.shape.id,
    }),

    body: request.json({
      schema: CreateReactionDTO,
    }),
  },

  responses: {
    [StatusCodes.CREATED]: response.json({
      schema: z.object({
        reaction: Reaction,
      }),
      description: "Reaction created successfully",
    }),

    [StatusCodes.FORBIDDEN]: errors.forbidden({
      description: "User not authorized to create reaction",
    }),

    [StatusCodes.BAD_REQUEST]: errors.badRequest({
      description: "Message does not exist in this chat",
    }),
  },
} satisfies RouteConfig;
