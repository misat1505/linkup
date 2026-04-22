import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ErrorMessage, Friendship } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const getUserFriendshipsRoute = {
  method: "get",
  path: "/friendships",
  summary: "Retrieve a list of user friendships",
  tags: [TAGS.FRIENDSHIPS],

  responses: {
    [StatusCodes.OK]: {
      description: "Friendships retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            friendships: z.array(Friendship),
          }),
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Cannot retrieve user friendships due to a server error",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
