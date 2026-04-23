import { ZodType } from "zod";

type JsonResponse = {
  schema: ZodType;
  description?: string;
};

const jsonResponse = (response: JsonResponse) => ({
  description: response.description ?? "",
  content: {
    "application/json": {
      schema: response.schema,
    },
  },
});

export const response = {
  json: jsonResponse,
};
