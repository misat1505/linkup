import { ZodType } from "zod";

type JsonResponse<T extends ZodType> = {
  schema: T;
  description?: string;
};

const jsonResponse = <T extends ZodType>(response: JsonResponse<T>) => ({
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
