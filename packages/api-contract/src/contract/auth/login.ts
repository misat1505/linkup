import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { LoginDTO, User } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const loginRoute = {
  method: "post",
  path: "/auth/login",
  summary: "Log in an existing user",
  tags: [TAGS.AUTH],

  request: {
    body: {
      content: {
        "application/json": {
          schema: LoginDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.OK]: {
      description: "User logged in successfully",
      content: {
        "application/json": {
          schema: z.object({
            user: User,
            accessToken: z.string(),
          }),
        },
      },
    },

    [StatusCodes.UNAUTHORIZED]: {
      description: "Invalid login or password",
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Cannot log in",
    },
  },
} satisfies RouteConfig;
