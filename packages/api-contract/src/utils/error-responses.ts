import { ErrorMessage } from "@packages/schemas";
import { ZodType } from "zod";

type ErrorResponse<T extends ZodType = typeof ErrorMessage> = {
	description: string;
	schema?: T;
};

function errorResponse(response: ErrorResponse): {
	description: string;
	content: { "application/json": { schema: typeof ErrorMessage } };
};
function errorResponse<T extends ZodType>(
	response: ErrorResponse<T>,
): {
	description: string;
	content: { "application/json": { schema: T } };
};
function errorResponse<T extends ZodType = typeof ErrorMessage>(response: ErrorResponse<T>) {
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
