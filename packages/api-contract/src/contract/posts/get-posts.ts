import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { GetPostsQuery, Post } from "@packages/schemas";
import z from "zod";

import { errors } from "../../utils/error-responses";
import { response } from "../../utils/responses";

export const getPostsRoute = {
  method: "get",
  path: "/posts",
  summary: "Retrieve a list of posts",
  tags: [TAGS.POSTS],

  request: {
    query: GetPostsQuery,
  },

  responses: {
    [StatusCodes.OK]: response.json({
      schema: z.object({ posts: z.array(Post) }),
      description: "A list of posts retrieved successfully",
    }),

    [StatusCodes.BAD_REQUEST]: errors.badRequest({
      description: "Invalid query parameter (e.g., limit exceeds 10)",
    }),
  },
} satisfies RouteConfig;
