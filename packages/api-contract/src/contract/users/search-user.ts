import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

import { ErrorMessage, SearchUserQuery, User } from "@packages/schemas";
import z from "zod";

export const searchUserRoute = {
  method: "get",
  path: "/users/search",
  summary: "Search users by term",
  description: "Search for users based on a search term.",
  tags: [TAGS.USERS],

  request: {
    query: SearchUserQuery,
  },

  responses: {
    [StatusCodes.OK]: {
      description: "A list of users matching the search term",
      content: {
        "application/json": {
          schema: z.object({ users: z.array(User) }),
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "Missing or invalid 'term' query parameter",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Couldn't search users",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
