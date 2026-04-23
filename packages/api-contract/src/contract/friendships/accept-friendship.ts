import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { AcceptFriendshipDTO, Friendship } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const acceptFriendshipRoute = {
  method: "post",
  path: "/friendships/accept",
  summary: "Accept an existing friendship request",
  tags: [TAGS.FRIENDSHIPS],

  request: {
    body: request.json({
      schema: AcceptFriendshipDTO,
    }),
  },

  responses: {
    [StatusCodes.OK]: response.json({
      schema: Friendship,
      description: "Friendship accepted successfully",
    }),

    [StatusCodes.BAD_REQUEST]: errors.badRequest({
      description: "Invalid friendship request or unauthorized action",
    }),

    [StatusCodes.CONFLICT]: errors.conflict({
      description: "Friendship request does not exist or is already processed",
    }),
  },
} satisfies RouteConfig;
