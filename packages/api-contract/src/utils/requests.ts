import { ZodType } from "zod";

type JsonRequest = {
  schema: ZodType;
  description?: string;
};

const jsonRequest = (request: JsonRequest) => ({
  description: request.description ?? "",
  content: {
    "application/json": {
      schema: request.schema,
    },
  },
});

const multipartRequest = (request: JsonRequest) => ({
  description: request.description ?? "",
  content: {
    "multipart/form-data": {
      schema: request.schema,
    },
  },
});

export const request = {
  json: jsonRequest,
  multipart: multipartRequest,
};
