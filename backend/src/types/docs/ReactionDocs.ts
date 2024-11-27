export const ReactionSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "The unique ID of the reaction",
      example: "f32bb9b7-91c6-4012-a4d3-b2f014cd2beb",
    },
    name: {
      type: "string",
      description: "The type of reaction (e.g., 'like', 'love')",
      example: "like",
    },
    messageId: {
      type: "string",
      description: "The ID of the message the reaction is attached to",
      example: "08bcfd50-073e-4b35-a5f6-03549504d18f",
    },
    user: {
      $ref: "#/components/schemas/User",
      description: "The user who reacted",
    },
  },
} as const;
