import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { ErrorMessage, GetPostsQuery, Post } from "@packages/schemas";
import z from "zod";

export const getPostsRoute = {
  method: "get",
  path: "/posts",
  summary: "Retrieve a list of posts",
  tags: [TAGS.POSTS],

  request: {
    query: GetPostsQuery,
  },

  responses: {
    [StatusCodes.OK]: {
      description: "A list of posts retrieved successfully",
      content: {
        "application/json": {
          schema: z.array(Post),
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "Invalid query parameter (e.g., limit exceeds 10)",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error, could not retrieve posts",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
