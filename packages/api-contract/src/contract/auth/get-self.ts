import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { User } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const getSelfRoute = {
  method: "get",
  path: "/auth/user",
  summary: "Get current user details",
  tags: [TAGS.AUTH],
  responses: {
    [StatusCodes.OK]: {
      description: "User fetched successfully",
      content: {
        "application/json": {
          schema: z.object({
            user: User,
          }),
        },
      },
    },
    [StatusCodes.NOT_FOUND]: {
      description: "User not found",
    },
    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Cannot fetch user",
    },
  },
} satisfies RouteConfig;
