import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { ErrorMessage, Post } from "@packages/schemas";
import z from "zod";

export const getPostRoute = {
  method: "get",
  path: "/posts/{id}",
  summary: "Get a post by its ID",
  tags: [TAGS.POSTS],

  request: {
    params: Post.pick({ id: true }),
  },

  responses: {
    [StatusCodes.OK]: {
      description: "Post retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({ post: Post }),
        },
      },
    },

    [StatusCodes.NOT_FOUND]: {
      description: "Post not found",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error, could not retrieve post",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
