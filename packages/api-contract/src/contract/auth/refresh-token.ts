import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { SuccessMessage } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { TAGS } from "../../utils/constants";
import { response } from "../../utils/responses";

export const refreshTokenRoute = {
  method: "post",
  path: "/auth/refresh",
  summary: "Refresh access token and refresh token",
  description:
    "This endpoint reads the refresh token from the request to authorize the user and generate a new access token.",
  tags: [TAGS.AUTH],

  responses: {
    [StatusCodes.OK]: response.json({
      description: "Token refreshed successfully",
      schema: SuccessMessage.extend({ accessToken: z.string() }),
    }),
  },
} satisfies RouteConfig;
