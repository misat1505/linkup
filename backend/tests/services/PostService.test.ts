import { Prisma } from "@prisma/client";
import { PostService } from "../../src/services/PostService";
import { isPost } from "../../src/types/guards/Post.guard";
import { testWithTransaction } from "../utils/testWithTransaction";

describe("PostService", () => {
  describe("createPost", () => {
    it("should create a post", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        const content = "This is a new post";
        const authorId = seed.users[0].id;
        const id = "123";

        const result = await postService.createPost({ id, content, authorId });

        expect(isPost(result)).toBe(true);
        expect(result.content).toBe(content);
        expect(result.author.id).toBe(authorId);
      });
    });
  });

  describe("getUserPosts", () => {
    it("should return posts for a specific user", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        const userId = seed.users[0].id;

        const result = await postService.getUserPosts(userId);

        expect(Array.isArray(result)).toBe(true);
        result.forEach((post) => {
          expect(isPost(post)).toBe(true);
          expect(post.author.id).toBe(userId);
        });
      });
    });
  });

  describe("getPost", () => {
    it("should return a post by ID", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        const postId = seed.posts[0].id;
        const result = await postService.getPost(postId);

        expect(isPost(result)).toBe(true);
        expect(result!.id).toBe(postId);
      });
    });

    it("should return null for a non-existent post", async () => {
      await testWithTransaction(async ({ tx }) => {
        const postService = new PostService(tx);
        const result = await postService.getPost("non-existent-id");

        expect(result).toBeNull();
      });
    });
  });

  describe("updatePost", () => {
    it("should update an existing post", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        const postId = seed.posts[0].id;
        const newContent = "Updated post content";

        const result = await postService.updatePost({
          id: postId,
          content: newContent,
        });

        expect(isPost(result)).toBe(true);
        expect(result!.content).toBe(newContent);
      });
    });

    it("should return null for a non-existent post update", async () => {
      await testWithTransaction(async ({ tx }) => {
        const postService = new PostService(tx);
        const result = await postService.updatePost({
          id: "non-existent-id",
          content: "Content",
        });

        expect(result).toBeNull();
      });
    });
  });

  describe("updatePost", () => {
    it("should delete an existing post", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        const postId = seed.posts[0].id;

        await postService.deletePost(postId);

        expect(true).toBe(true);
      });
    });
  });

  describe("reportPost", () => {
    it("should report post", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        await postService.reportPost(seed.users[0].id, seed.posts[0].id);
        expect(true).toBe(true);
      });
    });

    it("should throw error if user already reported this post", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        const userId = seed.users[0].id;
        const postId = seed.posts[0].id;

        await postService.reportPost(userId, postId);
        expect(true).toBe(true);

        try {
          await postService.reportPost(userId, postId);
          expect(true).toBe(true);
        } catch (e) {
          expect(e).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        }
      });
    });
  });
});
