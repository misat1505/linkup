import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { Post, SuccessMessage } from "@packages/schemas";

import { errors } from "../../utils/error-responses";
import { response } from "../../utils/responses";

export const reportPostRoute = {
  method: "post",
  path: "/posts/{id}/report",
  summary: "Report a post",
  tags: [TAGS.POSTS],

  request: {
    params: Post.pick({ id: true }),
  },

  responses: {
    [StatusCodes.OK]: response.json({
      schema: SuccessMessage,
      description: "Post reported successfully",
    }),

    [StatusCodes.CONFLICT]: errors.conflict({
      description: "This post has already been reported by you.",
    }),
  },
} satisfies RouteConfig;
