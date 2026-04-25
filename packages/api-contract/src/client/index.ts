import axios, { AxiosInstance, CreateAxiosDefaults } from "axios";
import { StatusCodes } from "http-status-codes";
import z from "zod";
import { API_CONTRACT, CONTRACT_KEYS } from "../contract";
import { extractResponseSchema, ExtractSchema } from "../utils";

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

type ExtractQuery<K extends keyof typeof API_CONTRACT> =
  (typeof API_CONTRACT)[K] extends {
    request: { query: infer S };
  }
    ? S extends z.ZodTypeAny
      ? z.infer<S>
      : never
    : never;

type ExtractResponse<
  K extends keyof typeof API_CONTRACT,
  S extends keyof (typeof API_CONTRACT)[K]["responses"],
> =
  ExtractSchema<K, S> extends z.ZodTypeAny
    ? z.infer<ExtractSchema<K, S>>
    : never;

export class ApiContractClient {
  api: AxiosInstance;

  constructor(options?: CreateAxiosDefaults) {
    this.api = axios.create(options);
  }

  async signup(
    body: Omit<ExtractRequestBody<typeof CONTRACT_KEYS.SIGNUP>, "file"> & {
      file?: File | null;
    },
  ): Promise<
    ExtractResponse<typeof CONTRACT_KEYS.SIGNUP, typeof StatusCodes.CREATED>
  > {
    const formData = new FormData();

    const { file, ...rest } = body;

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    if (file) {
      formData.append("file", file);
    }

    const { data } = await this.api.post(API_CONTRACT.SIGNUP.path, formData);

    const schema = extractResponseSchema(
      CONTRACT_KEYS.SIGNUP,
      StatusCodes.CREATED,
    );
    return schema!.parse(data);
  }
}
