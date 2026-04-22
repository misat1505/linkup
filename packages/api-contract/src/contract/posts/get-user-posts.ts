import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { ErrorMessage, Post } from "@packages/schemas";
import z from "zod";

export const getUserPostsRoute = {
  method: "get",
  path: "/posts/mine",
  summary: "Retrieve posts by the authenticated user",
  tags: [TAGS.POSTS],

  responses: {
    [StatusCodes.OK]: {
      description: "User's posts retrieved successfully",
      content: {
        "application/json": {
          schema: z.array(Post),
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error, couldn't retrieve user posts",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
