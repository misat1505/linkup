import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { UpdateUserAliasDTO } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { errors } from "../../utils/error-responses";
import { request } from "../../utils/requests";
import { response } from "../../utils/responses";

export const updateAliasRoute = {
  method: "put",
  path: "/chats/{chatId}/alias/{userId}",
  summary: "Update a user's alias in a group chat",
  tags: [TAGS.CHATS],

  request: {
    params: z.object({
      chatId: z.string(),
      userId: z.string(),
    }),

    body: request.json({
      schema: UpdateUserAliasDTO,
    }),
  },

  responses: {
    [StatusCodes.OK]: response.json({
      schema: z.object({
        alias: z.string(),
      }),
      description: "Alias updated successfully",
    }),

    [StatusCodes.BAD_REQUEST]: errors.badRequest({
      description: "User is not a member of this chat",
    }),

    [StatusCodes.FORBIDDEN]: errors.forbidden({
      description: "User not authorized to update aliases in this chat",
    }),
  },
} satisfies RouteConfig;
