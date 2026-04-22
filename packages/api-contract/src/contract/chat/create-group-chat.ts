import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Chat, CreateGroupChatDTO, ErrorMessage } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const createGroupChatRoute = {
  method: "post",
  path: "/chats/group",
  summary: "Create a new group chat",
  tags: [TAGS.CHATS],

  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: CreateGroupChatDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.CREATED]: {
      description: "Group chat created successfully",
      content: {
        "application/json": {
          schema: z.object({
            chat: Chat,
          }),
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "User not authorized to create group chat",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error when creating group chat",
    },
  },
} satisfies RouteConfig;
