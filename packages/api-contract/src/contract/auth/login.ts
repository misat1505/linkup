import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { LoginDTO, User } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const loginRoute = {
  method: "post",
  path: "/auth/login",
  summary: "Log in an existing user",
  tags: [TAGS.AUTH],

  request: {
    body: request.json({
      schema: LoginDTO,
      description: "Login credentials",
    }),
  },

  responses: {
    [StatusCodes.OK]: response.json({
      schema: z.object({
        user: User,
        accessToken: z.string(),
      }),
      description: "User logged in successfully",
    }),

    [StatusCodes.UNAUTHORIZED]: errors.unauthorized({
      description: "Invalid login or password",
    }),
  },
} satisfies RouteConfig;
