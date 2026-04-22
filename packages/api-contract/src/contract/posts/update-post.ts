import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { ErrorMessage, Post, UpdatePostDTO } from "@packages/schemas";
import z from "zod";

export const updatePostRoute = {
  method: "put",
  path: "/posts/{id}",
  summary: "Update an existing post by ID",
  tags: [TAGS.POSTS],

  request: {
    params: Post.pick({ id: true }),
    body: {
      content: {
        "application/json": {
          schema: UpdatePostDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.OK]: {
      description: "Post updated successfully",
      content: {
        "application/json": {
          schema: z.object({ post: Post }),
        },
      },
    },

    [StatusCodes.FORBIDDEN]: {
      description: "Unauthorized, user cannot edit this post",
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
      description: "Server error, couldn't update post",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
