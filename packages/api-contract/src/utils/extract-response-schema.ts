import { API_CONTRACT } from "../contract";

type ExtractSchema<
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
  // @ts-ignore
  const response = API_CONTRACT[key].responses[status];

  if ("content" in response) {
    return response.content["application/json"].schema;
  }

  // @ts-ignore
  return null;
}
