import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import {
  AcceptFriendshipDTO,
  ErrorMessage,
  Friendship,
} from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

export const acceptFriendshipRoute = {
  method: "post",
  path: "/friendships/accept",
  summary: "Accept an existing friendship request",
  tags: [TAGS.FRIENDSHIPS],

  request: {
    body: {
      content: {
        "application/json": {
          schema: AcceptFriendshipDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.OK]: {
      description: "Friendship accepted successfully",
      content: {
        "application/json": {
          schema: Friendship,
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "User not authorized to accept friendship",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.CONFLICT]: {
      description: "Friendship does not exist",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error while accepting friendship",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
