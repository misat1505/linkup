import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export * from "./chat";
export * from "./file";
export * from "./friendship";
export * from "./message";
export * from "./post";
export * from "./reaction";
export * from "./registry";
export * from "./user";
