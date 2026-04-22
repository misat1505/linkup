export const SCHEMA_REGISTRY = {
  USER: "User",
  USER_IN_CHAT: "UserInChat",
  CHAT: "Chat",
  MESSAGE: "Message",
  MESSAGE_RESPONSE: "MessageResponse",
  REACTION: "Reaction",
  FILE: "File",
  POST: "Post",
  POST_CHAT: "PostChat",
  FRIENDSHIP: "Friendship",
  DTO: {
    LOGIN_DTO: "LoginDTO",
  },
} as const;

export type SchemaName = (typeof SCHEMA_REGISTRY)[keyof typeof SCHEMA_REGISTRY];
