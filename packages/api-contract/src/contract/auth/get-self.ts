import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { User } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { response } from "../../utils/responses";

export const getSelfRoute = {
  method: "get",
  path: "/auth/user",
  summary: "Get current user details",
  tags: [TAGS.AUTH],
  responses: {
    [StatusCodes.OK]: response.json({
      schema: z.object({
        user: User,
      }),
      description: "User fetched successfully",
    }),

    [StatusCodes.NOT_FOUND]: errors.notFound({
      description: "User not found",
    }),
  },
} satisfies RouteConfig;
