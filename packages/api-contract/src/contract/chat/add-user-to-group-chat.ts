import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ErrorMessage, User } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const addUserToGroupChatRoute = {
  method: "post",
  path: "/chats/{chatId}/users",
  summary: "Add a user to a group chat",
  tags: [TAGS.CHATS],

  request: {
    params: z.object({
      chatId: z.string(),
    }),

    body: {
      content: {
        "application/json": {
          schema: z.object({
            userId: z.string(),
          }),
        },
      },
    },
  },

  responses: {
    [StatusCodes.CREATED]: {
      description: "User added to chat successfully",
      content: {
        "application/json": {
          schema: z.object({
            user: User,
          }),
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "Cannot add people to chat of this type",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.FORBIDDEN]: {
      description: "User not authorized to add to this chat",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.CONFLICT]: {
      description: "User is already in this chat",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error when adding user to chat",
    },
  },
} satisfies RouteConfig;
