import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { response } from "../../utils/responses";

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
    [StatusCodes.OK]: response.json({
      schema: z.object({
        message: z.string(),
      }),
      description: "File deleted successfully",
    }),

    [StatusCodes.NOT_FOUND]: errors.notFound({
      description: "File not found in cache",
    }),
  },
} satisfies RouteConfig;
