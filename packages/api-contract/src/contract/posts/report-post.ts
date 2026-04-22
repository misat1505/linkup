import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { ErrorMessage, Post } from "@packages/schemas";
import z from "zod";

export const reportPostRoute = {
  method: "post",
  path: "/posts/{id}/report",
  summary: "Report a post",
  tags: [TAGS.POSTS],

  request: {
    params: Post.pick({ id: true }),
  },

  responses: {
    [StatusCodes.OK]: {
      description: "Post reported successfully",
      content: {
        "application/json": {
          schema: z.object({ message: z.string() }),
        },
      },
    },

    [StatusCodes.CONFLICT]: {
      description: "This post had been previously reported by you.",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Couldn't report post.",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
