import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { ErrorMessage, Post } from "@packages/schemas";
import z from "zod";

export const deletePostRoute = {
  method: "delete",
  path: "/posts/{id}",
  summary: "Delete a post",
  tags: [TAGS.POSTS],

  request: {
    params: Post.pick({ id: true }),
  },

  responses: {
    [StatusCodes.OK]: {
      description: "Post deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },

    [StatusCodes.FORBIDDEN]: {
      description:
        "Unauthorized access. The user is not allowed to delete this post.",
      content: {
        "application/json": {
          schema: ErrorMessage,
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
      description: "Couldn't delete the post",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
