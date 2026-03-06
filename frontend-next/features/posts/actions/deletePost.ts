"use server";

import { POSTS_API } from "@/utils/api";
import { Post } from "../schemas/post";

export async function deletePost(id: Post["id"]): Promise<void> {
  await POSTS_API.delete(`/${id}`);
}
