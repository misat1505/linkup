import z from "zod";
import { Post } from "../post";
import { SCHEMA_REGISTRY } from "../registry";

export const CreatePostDTO = Post.pick({ content: true }).openapi(
	SCHEMA_REGISTRY.DTO.CREATE_POST_DTO,
);

export type CreatePostDTO = z.infer<typeof CreatePostDTO>;

export const UpdatePostDTO = Post.pick({ content: true }).openapi(
	SCHEMA_REGISTRY.DTO.UPDATE_POST_DTO,
);

export type UpdatePostDTO = z.infer<typeof UpdatePostDTO>;
