import { API_CONTRACT } from "@packages/api-contract";
import { Response } from "express";
import { ExtractData, sendValidatedResponse } from "./send-validated-response";

export function buildValidatedResponder<K extends keyof typeof API_CONTRACT>(
  res: Response,
  key: K,
) {
  return function send<S extends keyof (typeof API_CONTRACT)[K]["responses"]>(
    status: S,
    data: ExtractData<K, S>,
  ) {
    return sendValidatedResponse({ res, key, status, data });
  };
}
