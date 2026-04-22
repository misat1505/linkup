import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { ErrorMessage, Filename } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

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
    [StatusCodes.OK]: {
      description: "File retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            url: z.string(),
          }),
        },
      },
    },

    [StatusCodes.BAD_REQUEST]: {
      description: "Invalid request parameters",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.FORBIDDEN]: {
      description: "Unauthorized access",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.NOT_FOUND]: {
      description: "File not found",
      content: {
        "application/json": {
          schema: ErrorMessage,
        },
      },
    },

    [StatusCodes.INTERNAL_SERVER_ERROR]: {
      description: "Server error when fetching the file",
    },
  },
} satisfies RouteConfig;
