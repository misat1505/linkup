import { Post } from "@packages/schemas";
import z from "zod";

export const PostWithRenderedContent = Post.extend({
	renderedContent: z.string(),
});

export type PostWithRenderedContent = z.infer<typeof PostWithRenderedContent>;
