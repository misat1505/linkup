export const PostSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "Post ID",
      example: "f682a8f6-7c53-4f15-9f23-3aef548f1245",
    },
    content: {
      type: "string",
      description: "Content of the post",
      example: "This is the content of the post.",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "Post creation timestamp",
      example: "2024-09-12T14:30:00.000Z",
    },
    chat: {
      $ref: "#/components/schemas/Chat",
      description: "Associated chat object",
    },
    author: {
      $ref: "#/components/schemas/User",
      description: "Author of the post",
    },
  },
} as const;
