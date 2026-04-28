import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Chat, UpdateGroupChatDTO } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const updateGroupChatRoute = {
  method: "put",
  path: "/chats/{chatId}",
  summary: "Update a group chat",
  tags: [TAGS.CHATS],

  request: {
    params: z.object({
      chatId: Chat.shape.id,
    }),

    body: request.multipart({
      schema: UpdateGroupChatDTO,
    }),
  },

  responses: {
    [StatusCodes.OK]: response.json({
      schema: z.object({
        chat: Chat,
      }),
      description: "Chat updated successfully",
    }),

    [StatusCodes.FORBIDDEN]: errors.forbidden({
      description: "User not authorized to update this chat",
    }),

    [StatusCodes.BAD_REQUEST]: errors.badRequest({
      description: "Cannot update this type of chat",
    }),
  },
} satisfies RouteConfig;
