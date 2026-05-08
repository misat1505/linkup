import { Request } from "express";
import { z } from "zod";
import { ContractRoute } from "./build-router";

type ExtractRequest<T extends ContractRoute> = "request" extends keyof T
  ? {
      params: "params" extends keyof T["request"]
        ? T["request"]["params"] extends z.ZodTypeAny
          ? z.infer<T["request"]["params"]>
          : never
        : never;
      query: "query" extends keyof T["request"]
        ? T["request"]["query"] extends z.ZodTypeAny
          ? z.infer<T["request"]["query"]>
          : never
        : never;
      body: "body" extends keyof T["request"]
        ? T["request"]["body"] extends {
            content: { "application/json": { schema: z.ZodTypeAny } };
          }
          ? z.infer<
              T["request"]["body"]["content"]["application/json"]["schema"]
            >
          : T["request"]["body"] extends {
                content: { "multipart/form-data": { schema: z.ZodTypeAny } };
              }
            ? z.infer<
                T["request"]["body"]["content"]["multipart/form-data"]["schema"]
              >
            : never
        : never;
    }
  : never;

type OmitNever<T> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export function extractValidatedRequest<T extends ContractRoute>(
  req: Request,
  route: T,
): OmitNever<ExtractRequest<T>> {
  if (!("validated" in req)) throw new Error("Cannot read validated.");

  const validated = req.validated!;
  const result: Record<string, unknown> = {};

  if ("request" in route) {
    const reqSchema = route.request;

    if ("params" in reqSchema && validated.params !== undefined) {
      result.params = validated.params;
    }

    if ("query" in reqSchema && validated.query !== undefined) {
      result.query = validated.query;
    }

    if ("body" in reqSchema && validated.body !== undefined) {
      result.body = validated.body;
    }
  }

  return result as OmitNever<ExtractRequest<T>>;
}
