import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ErrorMessage, UpdateUserAliasDTO } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const updateAliasRoute = {
  method: "put",
  path: "/chats/{chatId}/alias/{userId}",
  summary: "Update a user's alias in a group chat",
  tags: [TAGS.CHATS],

  request: {
    params: z.object({
      chatId: z.string(),
      userId: z.string(),
    }),

    body: {
      content: {
        "application/json": {
          schema: UpdateUserAliasDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.OK]: {
      description: "Alias updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            alias: z.string(),
          }),
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "User does not belong to this chat",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.FORBIDDEN]: {
      description: "User not authorized to update alias",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error when updating alias",
    },
  },
} satisfies RouteConfig;
