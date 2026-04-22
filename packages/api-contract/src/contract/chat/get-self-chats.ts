import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Chat, ErrorMessage } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const getSelfChatsRoute = {
  method: "get",
  path: "/chats",
  summary: "Get all chats for a user",
  tags: [TAGS.CHATS],

  responses: {
    [StatusCodes.OK]: {
      description: "Chats retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            chats: z.array(Chat),
          }),
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error when fetching user's chats",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
