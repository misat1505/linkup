import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { DeleteFriendshipDTO, ErrorMessage } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const deleteFriendshipRoute = {
  method: "delete",
  path: "/friendships",
  summary: "Delete an existing friendship",
  tags: [TAGS.FRIENDSHIPS],

  request: {
    body: {
      content: {
        "application/json": {
          schema: DeleteFriendshipDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.OK]: {
      description: "Friendship deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "User not authorized to delete this friendship",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.NOT_FOUND]: {
      description: "Friendship not found",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error while deleting friendship",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
