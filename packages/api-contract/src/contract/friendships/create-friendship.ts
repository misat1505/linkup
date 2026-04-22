import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import {
  CreateFriendshipDTO,
  ErrorMessage,
  Friendship,
} from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

export const createFriendshipRoute = {
  method: "post",
  path: "/friendships",
  summary: "Create a new friendship request",
  tags: [TAGS.FRIENDSHIPS],

  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateFriendshipDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.CREATED]: {
      description: "Friendship created successfully",
      content: {
        "application/json": {
          schema: Friendship,
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "Requester mismatch",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.CONFLICT]: {
      description: "Friendship already exists",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error while creating friendship",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
