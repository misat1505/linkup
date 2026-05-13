import z from "zod";
import { API_CONTRACT } from "../contract";
import { ExtractSchema } from "../utils";

type ExtractRequestBody<K extends keyof typeof API_CONTRACT> =
  (typeof API_CONTRACT)[K] extends {
    request: { body: { content: { "application/json": { schema: infer S } } } };
  }
    ? S extends z.ZodTypeAny
      ? z.infer<S>
      : never
    : (typeof API_CONTRACT)[K] extends {
          request: {
            body: { content: { "multipart/form-data": { schema: infer S } } };
          };
        }
      ? S extends z.ZodTypeAny
        ? z.infer<S>
        : never
      : never;

export type ExtractResponse<
  K extends keyof typeof API_CONTRACT,
  S extends keyof (typeof API_CONTRACT)[K]["responses"],
> =
  ExtractSchema<K, S> extends z.ZodTypeAny
    ? z.infer<ExtractSchema<K, S>>
    : never;

type ReplaceFiles<T> = {
  [K in keyof T]: K extends "file"
    ? File | null | undefined
    : K extends "files"
      ? File[] | undefined
      : T[K];
};

type ExtractRequestParams<K extends keyof typeof API_CONTRACT> =
  (typeof API_CONTRACT)[K] extends { request: { params: infer S } }
    ? S extends z.ZodTypeAny
      ? z.infer<S>
      : never
    : never;

type ExtractRequestQuery<K extends keyof typeof API_CONTRACT> =
  (typeof API_CONTRACT)[K] extends { request: { query: infer S } }
    ? S extends z.ZodTypeAny
      ? z.infer<S>
      : never
    : never;

type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };

export type ClientBody<K extends keyof typeof API_CONTRACT> = OmitNever<{
  body: ReplaceFiles<ExtractRequestBody<K>>;
  params: ExtractRequestParams<K>;
  query: ExtractRequestQuery<K>;
}>;
