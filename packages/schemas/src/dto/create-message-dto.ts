import z from "zod";
import { Message } from "../message";
import { SCHEMA_REGISTRY } from "../registry";

export const CreateMessageDTO = Message.pick({ content: true })
  .extend({
    responseId: z.string().optional().openapi({
      description: "Optional message this is replying to",
      example: "msg_123",
    }),

    files: z.array(z.any()).optional().openapi({
      description: "Optional message attachments",
      format: "binary",
    }),
  })
  .openapi(SCHEMA_REGISTRY.DTO.CREATE_MESSAGE_DTO);

export type CreateMessageDTO = z.infer<typeof CreateMessageDTO>;
