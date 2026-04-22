import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Chat, ErrorMessage, UpdateGroupChatDTO } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const updateGroupChatRoute = {
  method: "put",
  path: "/chats/{chatId}",
  summary: "Update a group chat",
  tags: [TAGS.CHATS],

  request: {
    params: z.object({
      chatId: z.string(),
    }),

    body: {
      content: {
        "multipart/form-data": {
          schema: UpdateGroupChatDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.OK]: {
      description: "Chat updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            chat: Chat,
          }),
        },
      },
    },

    [StatusCodes.FORBIDDEN]: {
      description: "User not authorized to update this chat",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "Cannot update chat of this type",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error when updating chat",
    },
  },
} satisfies RouteConfig;
