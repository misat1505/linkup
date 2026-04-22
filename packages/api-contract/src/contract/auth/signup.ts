import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ErrorMessage, SignupDTO, User } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const signupRoute = {
  method: "post",
  path: "/auth/signup",
  summary: "Sign up a new user",
  tags: [TAGS.AUTH],

  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: SignupDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.CREATED]: {
      description: "User created successfully",
      content: {
        "application/json": {
          schema: z.object({
            user: User,
            accessToken: z.string(),
          }),
        },
      },
    },

    [StatusCodes.CONFLICT]: {
      description: "Login already taken",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Cannot create new user",
    },
  },
} satisfies RouteConfig;
