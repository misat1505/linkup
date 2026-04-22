import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ErrorMessage } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const deleteFromCacheRoute = {
  method: "delete",
  path: "/files/cache/{filename}",
  summary: "Delete a file from the user's cache",
  tags: [TAGS.FILES],

  request: {
    params: z.object({
      filename: z.string(),
    }),
  },

  responses: {
    [StatusCodes.OK]: {
      description: "File deleted successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },

    [StatusCodes.NOT_FOUND]: {
      description: "File not found in cache",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error during file deletion",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
