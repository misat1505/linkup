import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Chat, CreatePrivateChatDTO, ErrorMessage } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const createPrivateChatRoute = {
  method: "post",
  path: "/chats/private",
  summary: "Create a new private chat",
  tags: [TAGS.CHATS],

  request: {
    body: {
      content: {
        "application/json": {
          schema: CreatePrivateChatDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.CREATED]: {
      description: "Private chat created successfully",
      content: {
        "application/json": {
          schema: z.object({
            chat: Chat,
          }),
        },
      },
    },

    [StatusCodes.CONFLICT]: {
      description: "Chat already exists",
      content: {
        "application/json": {
          schema: z.object({
            chat: Chat,
          }),
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "User not in chat",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error when creating private chat",
    },
  },
} satisfies RouteConfig;
