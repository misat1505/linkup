export const ReactionSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "The unique ID of the reaction",
      example: "r27ac12d-78ca-45f2-9c2f-77e2c3d6789a",
    },
    name: {
      type: "string",
      description: "The type of reaction (e.g., 'like', 'love')",
      example: "like",
    },
    messageId: {
      type: "string",
      description: "The ID of the message the reaction is attached to",
      example: "m17bc32c-45cb-43f2-8d2f-67e3c4f6829b",
    },
    user: {
      $ref: "#/components/schemas/User",
      description: "The user who reacted",
    },
  },
} as const;
