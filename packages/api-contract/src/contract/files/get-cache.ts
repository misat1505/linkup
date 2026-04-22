import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ErrorMessage } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

export const getCacheRoute = {
  method: "get",
  path: "/files/cache",
  summary: "Retrieve a list of files from the user's cache",
  tags: [TAGS.FILES],

  responses: {
    [StatusCodes.OK]: {
      description: "Files in the cache listed successfully",
      content: {
        "application/json": {
          schema: z.object({
            files: z.array(z.string()),
          }),
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Cannot read cache due to a server error",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },
  },
} satisfies RouteConfig;
