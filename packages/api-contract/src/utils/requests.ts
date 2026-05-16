import { ZodType } from "zod";

type JsonRequest<T extends ZodType> = {
	schema: T;
	description?: string;
};

const jsonRequest = <T extends ZodType>(request: JsonRequest<T>) => ({
	description: request.description ?? "",
	content: {
		"application/json": {
			schema: request.schema,
		},
	},
});

const multipartRequest = <T extends ZodType>(request: JsonRequest<T>) => ({
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
