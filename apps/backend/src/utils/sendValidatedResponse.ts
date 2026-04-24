import {
  API_CONTRACT,
  extractResponseSchema,
  ExtractSchema,
} from "@packages/api-contract";
import { Response } from "express";
import { z } from "zod";

export type ExtractData<
  K extends keyof typeof API_CONTRACT,
  S extends keyof (typeof API_CONTRACT)[K]["responses"],
> =
  ExtractSchema<K, S> extends z.ZodTypeAny
    ? z.infer<ExtractSchema<K, S>>
    : never;

export function sendValidatedResponse<
  K extends keyof typeof API_CONTRACT,
  S extends keyof (typeof API_CONTRACT)[K]["responses"],
>(params: { res: Response; key: K; status: S; data: ExtractData<K, S> }): void {
  const { res, key, status, data } = params;
  const schema = extractResponseSchema(key, status);

  if (!schema) {
    res.status(status as number).send();
    return;
  }

  // @ts-expect-error suppress
  const parsed = schema.parse(data);
  res.status(status as number).json(parsed);
}
