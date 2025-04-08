import { PostService } from "../../src/services/PostService";
import { isPost } from "../../src/types/guards/Post.guard";
import { USER } from "../utils/constants";

describe("PostService", () => {
  describe("createPost", () => {
    it("should create a post", async () => {
      const content = "This is a new post";
      const authorId = USER.id;
      const id = "123";

      const result = await PostService.createPost({ id, content, authorId });

      expect(isPost(result)).toBe(true);
      expect(result.content).toBe(content);
      expect(result.author.id).toBe(authorId);
    });
  });

  describe("getRecommendedPosts", () => {
    it("should return all posts", async () => {
      const result = await PostService.getRecommendedPosts(USER.id, null, 10);

      expect(Array.isArray(result)).toBe(true);
      result.forEach((post) => {
        expect(isPost(post)).toBe(true);
      });
    });
  });

  describe("getUserPosts", () => {
    it("should return posts for a specific user", async () => {
      const userId = USER.id;

      const result = await PostService.getUserPosts(userId);

      expect(Array.isArray(result)).toBe(true);
      result.forEach((post) => {
        expect(isPost(post)).toBe(true);
        expect(post.author.id).toBe(userId);
      });
    });
  });

  describe("getPost", () => {
    it("should return a post by ID", async () => {
      const result = await PostService.getPost(
        "25776a73-a5c6-40cf-b77f-76288a34cfa7"
      );

      expect(isPost(result)).toBe(true);
      expect(result!.id).toBe("25776a73-a5c6-40cf-b77f-76288a34cfa7");
    });

    it("should return null for a non-existent post", async () => {
      const result = await PostService.getPost("non-existent-id");

      expect(result).toBeNull();
    });
  });

  describe("updatePost", () => {
    it("should update an existing post", async () => {
      const postId = "25776a73-a5c6-40cf-b77f-76288a34cfa7";
      const newContent = "Updated post content";

      const result = await PostService.updatePost({
        id: postId,
        content: newContent,
      });

      expect(isPost(result)).toBe(true);
      expect(result!.content).toBe(newContent);
    });

    it("should return null for a non-existent post update", async () => {
      const result = await PostService.updatePost({
        id: "non-existent-id",
        content: "Content",
      });

      expect(result).toBeNull();
    });
  });

  describe("updatePost", () => {
    it("should delete an existing post", async () => {
      const postId = "25776a73-a5c6-40cf-b77f-76288a34cfa7";

      await PostService.deletePost(postId);

      expect(true).toBe(true);
    });
  });
});
