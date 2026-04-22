import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

export const logoutRoute = {
  method: "post",
  path: "/auth/logout",
  summary: "Log out a user",
  tags: [TAGS.AUTH],

  responses: {
    [StatusCodes.OK]: {
      description: "User logged out successfully",
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Cannot log out",
    },
  },
} satisfies RouteConfig;
