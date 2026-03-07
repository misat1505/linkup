"use server";
import { Post } from "@/features/posts/schemas/post";
import { POSTS_API } from "@/utils/api";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { revalidatePath } from "next/cache";
import { revalidateTag } from "next/cache";

export async function updatePost({
  id,
  content,
}: Pick<Post, "id" | "content">): Promise<Post> {
  const api = await serverSideRequestFactory({
    base: POSTS_API,
    include: {
      accessToken: true,
    },
  });

  const response = await api.put(`/${id}`, { content });

  const post = Post.parse(response.data.post);

  // revalidateTag(`post-${post.id}`, "max");
  revalidatePath("/posts");

  return post;
}
