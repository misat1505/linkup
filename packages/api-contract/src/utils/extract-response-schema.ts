import { API_CONTRACT } from "../contract";

export type ExtractSchema<
	K extends keyof typeof API_CONTRACT,
	S extends keyof (typeof API_CONTRACT)[K]["responses"],
> = (typeof API_CONTRACT)[K]["responses"][S] extends {
	content: { "application/json": { schema: infer Schema } };
}
	? Schema
	: null;

export function extractResponseSchema<
	K extends keyof typeof API_CONTRACT,
	S extends keyof (typeof API_CONTRACT)[K]["responses"],
>(key: K, status: S): ExtractSchema<K, S> {
	// @ts-expect-error Runtime access to generic key `key` produces `any`; types are enforced via ExtractSchema at call sites
	const response = API_CONTRACT[key].responses[status];

	if ("content" in response) {
		return response.content["application/json"].schema;
	}

	// @ts-expect-error Conditional type ExtractSchema<K, S> may resolve to non-null at call sites, but null is a valid runtime fallback
	return null;
}
