import { Post } from "@/types/Post";
import { POSTS_API } from "./utils";

export class PostService {
  static async deletePost(id: Post["id"]): Promise<void> {
    await POSTS_API.delete(`/${id}`);
  }

  static async updatePost({
    id,
    content,
  }: {
    id: Post["id"];
    content: Post["content"];
  }): Promise<Post> {
    const response = await POSTS_API.put(`/${id}`, { content });
    return response.data.post;
  }

  static async getPost(id: Post["id"]): Promise<Post | null> {
    const response = await POSTS_API.get(`/${id}`);
    return response.data.post;
  }

  static async getMyPosts(): Promise<Post[]> {
    const response = await POSTS_API.get("/mine");
    return response.data.posts;
  }

  static async getRecommendedPosts(
    lastPostId: Post["id"] | null,
    limit: number
  ): Promise<Post[]> {
    const params = new URLSearchParams();
    params.set("lastPostId", lastPostId || "null");
    params.set("limit", limit.toString());

    const response = await POSTS_API.get("/", { params });
    return response.data.posts;
  }

  static async createPost(content: string): Promise<Post> {
    const response = await POSTS_API.post("/", { content });
    return response.data.post;
  }

  static async reportPost(postId: Post["id"]): Promise<void> {
    await POSTS_API.post(`/${postId}/report`);
  }
}
