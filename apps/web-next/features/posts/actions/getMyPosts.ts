"use server";
import { apiContractClient } from "@/lib/apiQueryClient";
import { PostWithRenderedContent } from "../schemas/post-with-rendered-content";
import { getCachedRenderedPost } from "../utils/renderPost";
import { sortPosts } from "../utils/sortPosts";

export async function getMyPosts(): Promise<PostWithRenderedContent[]> {
  const res = await apiContractClient.getUserPosts();

  const sortedPosts = sortPosts(res.posts);

  const renderedPosts = await Promise.all(
    sortedPosts.map((post) => getCachedRenderedPost(post)),
  );

  return renderedPosts;
}
