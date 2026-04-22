import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";

export const refreshTokenRoute = {
  method: "post",
  path: "/auth/refresh",
  summary: "Refresh access token and refresh token",
  description:
    "This endpoint reads the refresh token from the request to authorize the user and generate a new access token.",
  tags: [TAGS.AUTH],

  responses: {
    [StatusCodes.OK]: {
      description: "Token refreshed successfully",
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Cannot refresh token",
    },
  },
} satisfies RouteConfig;
