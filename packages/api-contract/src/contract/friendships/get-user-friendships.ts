import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Friendship } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { response } from "../../utils/responses";

export const getUserFriendshipsRoute = {
  method: "get",
  path: "/friendships",
  summary: "Retrieve a list of user friendships",
  tags: [TAGS.FRIENDSHIPS],

  responses: {
    [StatusCodes.OK]: response.json({
      schema: z.object({
        friendships: z.array(Friendship),
      }),
      description: "Friendships retrieved successfully",
    }),
  },
} satisfies RouteConfig;
