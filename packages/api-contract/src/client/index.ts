import { ClientBody } from "./types";

import { AxiosInstance } from "axios";
import { StatusCodes } from "http-status-codes";
import { API_CONTRACT, CONTRACT_KEYS } from "../contract";
import { extractResponseSchema } from "../utils";
import { buildFormData } from "./build-form-data";
import { ExtractResponse } from "./types";

export class ApiContractClient {
  constructor(private readonly api: AxiosInstance) {}

  private async request<
    TKey extends keyof typeof API_CONTRACT,
    TStatus extends keyof (typeof API_CONTRACT)[TKey]["responses"],
  >(
    key: TKey,
    status: TStatus,
    {
      body,
      params,
      query,
    }: { body?: unknown; params?: Record<string, string>; query?: unknown },
    asFormData = false,
  ): Promise<ExtractResponse<TKey, TStatus>> {
    const contract = API_CONTRACT[key];

    const url = params
      ? contract.path.replace(/{(\w+)}/g, (_, k) => params[k] ?? `{${k}}`)
      : contract.path;

    const { data: responseData } = await this.api.request({
      method: contract.method,
      url,
      data:
        body !== undefined
          ? asFormData
            ? buildFormData(body as any)
            : body
          : undefined,
      params: query,
    });

    const schema = extractResponseSchema(key, status) as any;
    return schema.parse(responseData);
  }

  login(args: ClientBody<typeof CONTRACT_KEYS.LOGIN>) {
    return this.request(CONTRACT_KEYS.LOGIN, StatusCodes.OK, args);
  }

  signup(args: ClientBody<typeof CONTRACT_KEYS.SIGNUP>) {
    return this.request(CONTRACT_KEYS.SIGNUP, StatusCodes.CREATED, args, true);
  }

  createMessage(args: ClientBody<typeof CONTRACT_KEYS.CREATE_MESSAGE>) {
    return this.request(
      CONTRACT_KEYS.CREATE_MESSAGE,
      StatusCodes.CREATED,
      args,
      true,
    );
  }

  getSelfChats(args: ClientBody<typeof CONTRACT_KEYS.GET_SELF_CHATS>) {
    return this.request(CONTRACT_KEYS.GET_SELF_CHATS, StatusCodes.OK, args);
  }
}
