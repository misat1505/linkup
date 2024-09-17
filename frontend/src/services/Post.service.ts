import { Post } from "@/types/Post";
import { POSTS_API } from "./utils";

export class PostService {
  static async getPosts(): Promise<Post[]> {
    const response = await POSTS_API.get("/");
    return response.data.posts;
  }

  static async createPost(content: string): Promise<Post> {
    const response = await POSTS_API.post("/", { content });
    return response.data.post;
  }
}
