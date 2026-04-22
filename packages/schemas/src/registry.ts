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
    SIGNUP_DTO: "SignupDTO",
    CREATE_GROUP_CHAT_DTO: "CreateGroupChatDTO",
    CREATE_MESSAGE_DTO: "CreateMessageDTO",
    CREATE_PRIVATE_CHAT_DTO: "CreatePrivateChatDTO",
    CREATE_REACTION_DTO: "CreateReactionDTO",
    UPDATE_USER_ALIAS_DTO: "UpdateUserAliasDTO",
    UPDATE_GROUP_CHAT_DTO: "UpdateGroupChatDTO",
  },
  MISC: {
    ERROR_MESSAGE: "ErrorMessage",
  },
} as const;

export type SchemaName = (typeof SCHEMA_REGISTRY)[keyof typeof SCHEMA_REGISTRY];
