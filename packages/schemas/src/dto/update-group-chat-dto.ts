import z from "zod";
import { SCHEMA_REGISTRY } from "../registry";
import { CreateGroupChatDTO } from "./create-group-chat-dto";

export const UpdateGroupChatDTO = CreateGroupChatDTO.pick({
  name: true,
  file: true,
}).openapi(SCHEMA_REGISTRY.DTO.UPDATE_GROUP_CHAT_DTO);

export type UpdateGroupChatDTO = z.infer<typeof UpdateGroupChatDTO>;
