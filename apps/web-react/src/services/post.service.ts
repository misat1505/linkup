import { apiContractClient } from "@/lib/api-contract-client";
import { Post } from "@packages/schemas";

export class PostService {
  static async deletePost(id: Post["id"]): Promise<void> {
    await apiContractClient.deletePost({ params: { id } });
  }

  static async updatePost({
    id,
    content,
  }: {
    id: Post["id"];
    content: Post["content"];
  }): Promise<Post> {
    const res = await apiContractClient.updatePost({
      body: { content },
      params: { id },
    });
    return res.post;
  }

  static async getPost(id: Post["id"]): Promise<Post | null> {
    const res = await apiContractClient.getPost({ params: { id } });
    return res.post;
  }

  static async getMyPosts(): Promise<Post[]> {
    const res = await apiContractClient.getUserPosts();
    return res.posts;
  }

  static async getRecommendedPosts(
    lastPostId: Post["id"] | null,
    limit: number,
  ): Promise<Post[]> {
    const res = await apiContractClient.getPosts({
      query: { lastPostId, limit },
    });

    return res.posts.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
  }

  static async createPost(content: string): Promise<Post> {
    const res = await apiContractClient.createPost({ body: { content } });
    return res.post;
  }

  static async reportPost(postId: Post["id"]): Promise<void> {
    await apiContractClient.reportPost({ params: { id: postId } });
  }
}
