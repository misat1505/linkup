import { RouteConfig } from "@asteasolutions/zod-to-openapi";
import { User } from "@packages/schemas";
import { z } from "zod";

export const getSelfRoute: RouteConfig = {
  method: "get",
  path: "/auth/user",
  summary: "Get current user details",
  tags: ["Auth"],
  responses: {
    200: {
      description: "User fetched successfully",
      content: {
        "application/json": {
          schema: z.object({
            user: User,
          }),
        },
      },
    },
    404: {
      description: "User not found",
    },
    500: {
      description: "Cannot fetch user",
    },
  },
};
