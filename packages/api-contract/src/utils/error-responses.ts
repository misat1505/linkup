import { ErrorMessage } from "@packages/schemas";
import { ZodType } from "zod";

type ErrorResponse = {
  description: string;
  schema?: ZodType;
};

function errorResponse(response: ErrorResponse) {
  const schema = response.schema ?? ErrorMessage;

  return {
    description: response.description,
    content: {
      "application/json": {
        schema,
      },
    },
  };
}

export const errors = {
  forbidden: errorResponse,
  notFound: errorResponse,
  badRequest: errorResponse,
  conflict: errorResponse,
  unauthorized: errorResponse,
};
