import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { CreatePostDTO, ErrorMessage, Post } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

export const createPostRoute = {
  method: "post",
  path: "/posts",
  summary: "Create a new post",
  tags: [TAGS.POSTS],

  request: {
    body: {
      content: {
        "application/json": {
          schema: CreatePostDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.CREATED]: {
      description: "Post created successfully",
      content: {
        "application/json": {
          schema: Post,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error, could not create post",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
