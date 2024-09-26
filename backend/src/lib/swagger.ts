import swaggerJsdoc, { Options } from "swagger-jsdoc";
import { UserSchema } from "../types/docs/UserDocs";
import { ReactionSchema } from "../types/docs/ReactionDocs";
import { FileSchema } from "../types/docs/FileDocs";
import {
  MessageResponseSchema,
  MessageSchema,
} from "../types/docs/MessageDocs";
import { ChatSchema, UserInChatSchema } from "../types/docs/ChatDocs";
import { PostSchema } from "../types/docs/PostDocs";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LinkUp API Docs",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: "https://localhost:5500",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: UserSchema,
        Reaction: ReactionSchema,
        File: FileSchema,
        Message: MessageSchema,
        Chat: ChatSchema,
        Post: PostSchema,
        MessageResponse: MessageResponseSchema,
        UserInChat: UserInChatSchema,
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
