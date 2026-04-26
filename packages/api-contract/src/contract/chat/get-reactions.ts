import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { Reaction } from "@packages/schemas";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import { TAGS } from "../../utils/constants";

import { response } from "../../utils/responses";

const ReactionBase = Reaction.pick({ id: true, name: true });

export const getReactionsRoute = {
  method: "get",
  path: "/chats/reactions",
  summary: "Get all available reactions",
  tags: [TAGS.CHATS],

  responses: {
    [StatusCodes.OK]: response.json({
      schema: z.object({
        reactions: z.array(ReactionBase),
      }),
      description: "All reactions",
    }),
  },
} satisfies RouteConfig;
