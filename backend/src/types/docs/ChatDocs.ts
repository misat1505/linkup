export const UserInChatSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "User ID",
      example: "d0683f62-4c30-4eef-9578-7eac5c814c47",
    },
    firstName: { type: "string", description: "First name", example: "John" },
    lastName: { type: "string", description: "Last name", example: "Doe" },
    photoURL: {
      type: "string",
      nullable: true,
      description: "Profile photo URL",
      example: "https://example.com/photo.jpg",
    },
    lastActive: {
      type: "string",
      format: "date-time",
      description: "Last active time",
      example: "2024-09-12T14:35:45.000Z",
    },
    alias: {
      type: "string",
      nullable: true,
      description: "Alias of the user in chat",
      example: "Johnny",
    },
  },
} as const;

export const ChatSchema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      description: "Chat ID",
      example: "a98a7149-30f5-4eea-bfab-eebe063b342f",
    },
    createdAt: {
      type: "string",
      format: "date-time",
      description: "Chat creation time",
      example: "2024-09-12T14:30:00.000Z",
    },
    name: {
      type: "string",
      nullable: true,
      description: "Chat name",
      example: "Family Group",
    },
    photoURL: {
      type: "string",
      nullable: true,
      description: "Chat photo URL",
      example: "https://example.com/chat-photo.jpg",
    },
    type: {
      type: "string",
      enum: ["PRIVATE", "GROUP", "POST"],
      description: "Type of chat",
      example: "GROUP",
    },
    users: {
      type: "array",
      items: { $ref: "#/components/schemas/UserInChat" },
      nullable: true,
      description: "Users in the chat",
    },
    lastMessage: {
      $ref: "#/components/schemas/MessageResponse",
      nullable: true,
      description: "Last message in the chat",
    },
  },
} as const;
