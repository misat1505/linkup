import z from "zod";
import { UserInChat } from "../chat";
import { SCHEMA_REGISTRY } from "../registry";

export const UpdateUserAliasDTO = UserInChat.pick({ alias: true }).openapi(
  SCHEMA_REGISTRY.DTO.UPDATE_USER_ALIAS_DTO,
);

export type UpdateUserAliasDTO = z.infer<typeof UpdateUserAliasDTO>;
