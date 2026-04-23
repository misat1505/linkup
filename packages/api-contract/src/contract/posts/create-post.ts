import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { CreatePostDTO, Post } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const createPostRoute = {
  method: "post",
  path: "/posts",
  summary: "Create a new post",
  tags: [TAGS.POSTS],

  request: {
    body: request.json({ schema: CreatePostDTO }),
  },

  responses: {
    [StatusCodes.CREATED]: response.json({
      schema: Post,
      description: "Post created successfully",
    }),
  },
} satisfies RouteConfig;
