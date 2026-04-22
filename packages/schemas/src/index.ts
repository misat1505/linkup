import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export * from "./chat";
export * from "./dto";
export * from "./file";
export * from "./friendship";
export * from "./message";
export * from "./misc";
export * from "./post";
export * from "./reaction";
export * from "./registry";
export * from "./user";
