import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { CreateMessageDTO, ErrorMessage, Message } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const createMessageRoute = {
  method: "post",
  path: "/chats/{chatId}/messages",
  summary: "Create a new message in a chat",
  tags: [TAGS.CHATS],

  request: {
    params: z.object({
      chatId: z.string(),
    }),

    body: {
      content: {
        "multipart/form-data": {
          schema: CreateMessageDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.CREATED]: {
      description: "Message created successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: Message,
          }),
        },
      },
    },

    [StatusCodes.FORBIDDEN]: {
      description: "User not authorized to send a message",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "Response message does not exist in this chat",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error when creating message",
    },
  },
} satisfies RouteConfig;
