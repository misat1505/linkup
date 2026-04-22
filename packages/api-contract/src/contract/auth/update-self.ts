import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ErrorMessage, SignupDTO, User } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const updateSelfRoute = {
  method: "put",
  path: "/auth/user",
  summary: "Update user details",
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
    [StatusCodes.OK]: {
      description: "User updated successfully",
      content: {
        "application/json": {
          schema: z.object({
            user: User,
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
      description: "Cannot update user",
    },
  },
} satisfies RouteConfig;
