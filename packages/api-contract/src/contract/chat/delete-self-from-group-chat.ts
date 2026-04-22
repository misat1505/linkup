import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ErrorMessage } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const deleteSelfFromGroupChatRoute = {
  method: "delete",
  path: "/chats/{chatId}/users",
  summary: "Remove a user from a group chat",
  tags: [TAGS.CHATS],

  request: {
    params: z.object({
      chatId: z.string(),
    }),
  },

  responses: {
    [StatusCodes.OK]: {
      description: "Successfully deleted from chat",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "Bad request - user not in chat or wrong chat type",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error when removing user from chat",
    },
  },
} satisfies RouteConfig;
