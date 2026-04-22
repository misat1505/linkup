import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ErrorMessage, InsertToCacheDTO } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const insertToCacheRoute = {
  method: "post",
  path: "/files/cache",
  summary: "Upload a file to the user's cache",
  tags: [TAGS.FILES],

  request: {
    body: {
      content: {
        "multipart/form-data": {
          schema: InsertToCacheDTO,
        },
      },
    },
  },

  responses: {
    [StatusCodes.CREATED]: {
      description: "File uploaded successfully",
      content: {
        "application/json": {
          schema: z.object({
            file: z.string(),
          }),
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "Cache limit reached or no file provided",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error during upload",
    },
  },
} satisfies RouteConfig;
