"use server";
import { POSTS_API } from "@/utils/api";
import { Post, PostWithRenderedContent } from "../schemas/post";
import z from "zod";
import { serverSideRequestFactory } from "@/utils/serverSideRequestFactory";
import { getCachedRenderedPost } from "../utils/renderPost";
import { sortPosts } from "../utils/sortPosts";

export async function getMyPosts(): Promise<PostWithRenderedContent[]> {
  const api = await serverSideRequestFactory({
    base: POSTS_API,
    include: {
      accessToken: true,
    },
  });

  const response = await api.get("/mine");
  const posts = z.array(Post).parse(response.data.posts);

  const sortedPosts = sortPosts(posts);

  const renderedPosts = await Promise.all(
    sortedPosts.map((post) => getCachedRenderedPost(post)),
  );

  return renderedPosts;
}
