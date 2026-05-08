import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { SuccessMessage } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { TAGS } from "../../utils/constants";
import { response } from "../../utils/responses";

export const logoutRoute = {
  method: "post",
  path: "/auth/logout",
  summary: "Log out a user",
  tags: [TAGS.AUTH],

  responses: {
    [StatusCodes.OK]: response.json({
      description: "User logged out successfully",
      schema: SuccessMessage,
    }),
  },
} satisfies RouteConfig;
