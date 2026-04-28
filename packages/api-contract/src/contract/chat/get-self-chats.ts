import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Chat } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { response } from "../../utils/responses";

export const getSelfChatsRoute = {
  method: "get",
  path: "/chats",
  summary: "Get all chats for a user",
  tags: [TAGS.CHATS],

  responses: {
    [StatusCodes.OK]: response.json({
      schema: z.object({
        chats: z.array(Chat),
      }),
      description: "Chats retrieved successfully",
    }),
  },
} satisfies RouteConfig;
