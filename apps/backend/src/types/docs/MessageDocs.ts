export const MessageResponseSchema = {
  type: "object",
  description:
    "Response to the original message, without nested responses or reactions",
  properties: {
    id: {
      type: "string",
      description: "Message ID",
      example: "019219a8-eaa3-73ac-93cb-60c2d0d25d8a",
    },
    content: {
      type: "string",
      nullable: true,
      description: "Message content",
      example: "This is a reply",
    },
    author: {
      $ref: "#/components/schemas/User",
      description: "Author of the message",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "Message creation time",
      example: "2024-09-12T15:30:00.000Z",
    },
    chatId: {
      type: "string",
      description: "ID of the chat this message belongs to",
      example: "81fabe96-a6d8-44f9-93a9-634fbf01ecf3",
    },
    files: {
      type: "array",
      items: { $ref: "#/components/schemas/File" },
      description: "Files attached to the message",
    },
  },
} as const;

export const MessageSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "Message ID",
      example: "019219a9-15fa-716a-8bbf-6da675e52073",
    },
    content: {
      type: "string",
      nullable: true,
      description: "Message content",
      example: "Hello world!",
    },
    author: {
      $ref: "#/components/schemas/User",
      description: "Author of the message",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "Message creation time",
      example: "2024-09-12T14:30:00.000Z",
    },
    response: {
      $ref: "#/components/schemas/MessageResponse",
      nullable: true,
      description: "Optional response to another message",
    },
    chatId: {
      type: "string",
      description: "Chat ID the message belongs to",
      example: "f32bb9b7-91c6-4012-a4d3-b2f014cd2beb",
    },
    files: {
      type: "array",
      items: { $ref: "#/components/schemas/File" },
      description: "Files attached to the message",
    },
    reactions: {
      type: "array",
      items: { $ref: "#/components/schemas/Reaction" },
      description: "Reactions to the message",
    },
  },
} as const;
