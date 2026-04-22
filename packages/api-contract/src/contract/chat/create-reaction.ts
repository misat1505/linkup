import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { CreateReactionDTO, ErrorMessage, Reaction } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const createReactionRoute = {
  method: "post",
  path: "/chats/{chatId}/reactions",
  summary: "Create a reaction to a message in a chat",
  tags: [TAGS.CHATS],

  request: {
    params: z.object({
      chatId: z.string(),
    }),

    body: {
      content: {
        "application/json": {
          schema: CreateReactionDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.CREATED]: {
      description: "Reaction created successfully",
      content: {
        "application/json": {
          schema: z.object({
            reaction: Reaction,
          }),
        },
      },
    },

    [StatusCodes.FORBIDDEN]: {
      description: "User not authorized to create reaction",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "Message does not exist in this chat",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error when creating reaction",
    },
  },
} satisfies RouteConfig;
