import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Filename } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { response } from "../../utils/responses";

export const FileQueryOpenApi = z
  .object({
    filter: z.enum(["avatar", "chat-message", "chat-photo", "cache", "post"]),
    chat: z.uuid().optional(),
    post: z.uuid().optional(),
  })
  .openapi({
    description: "File filter query",
  });

export const getFileRoute = {
  method: "get",
  path: "/files/{filename}",
  summary: "Retrieve a file",
  tags: [TAGS.FILES],

  request: {
    params: Filename,
    query: FileQueryOpenApi,
  },

  responses: {
    [StatusCodes.OK]: response.json({
      schema: z.object({
        url: z.string(),
      }),
      description: "File retrieved successfully",
    }),

    [StatusCodes.BAD_REQUEST]: errors.badRequest({
      description: "Invalid file query parameters",
    }),

    [StatusCodes.FORBIDDEN]: errors.forbidden({
      description: "You are not allowed to access this file",
    }),

    [StatusCodes.NOT_FOUND]: errors.notFound({
      description: "File not found",
    }),
  },
} satisfies RouteConfig;
