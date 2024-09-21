import swaggerJsdoc, { Options } from "swagger-jsdoc";
import { UserSchema } from "../types/docs/UserDocs";

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
