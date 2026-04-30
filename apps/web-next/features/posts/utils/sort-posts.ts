import { Post } from "@packages/schemas";

export function sortPosts(posts: Post[]): Post[] {
  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
