import { Post } from "@/types/Post";
import { POSTS_API } from "./utils";

export class PostService {
  static async updatePost({
    id,
    content
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

  static async getPosts(): Promise<Post[]> {
    const response = await POSTS_API.get("/");
    return response.data.posts;
  }

  static async createPost(content: string): Promise<Post> {
    const response = await POSTS_API.post("/", { content });
    return response.data.post;
  }
}
