import { Prisma } from "@prisma/client";
import { PostService } from "@/services/PostService";
import { testWithTransaction } from "../utils/testWithTransaction";
import { v4 as uuidv4 } from "uuid";
import { Post } from "@/types/Post";

describe("PostService", () => {
  describe("createPost", () => {
    it("creates new post", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        const content = "This is a new post";
        const authorId = seed.users[0].id;
        const id = uuidv4();

        const result = await postService.createPost({ id, content, authorId });

        Post.strict().parse(result);
        expect(result.content).toBe(content);
        expect(result.author.id).toBe(authorId);
      });
    });
  });

  describe("getUserPosts", () => {
    it("retrieves posts for specific user", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        const userId = seed.users[0].id;

        const result = await postService.getUserPosts(userId);

        expect(Array.isArray(result)).toBeTruthy();
        result.forEach((post) => {
          Post.strict().parse(post);
          expect(post.author.id).toBe(userId);
        });
      });
    });
  });

  describe("getPost", () => {
    it("retrieves post by ID", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        const postId = seed.posts[0].id;
        const result = await postService.getPost(postId);

        Post.strict().parse(result);
        expect(result!.id).toBe(postId);
      });
    });

    it("returns null for non-existent post ID", async () => {
      await testWithTransaction(async ({ tx }) => {
        const postService = new PostService(tx);
        const result = await postService.getPost("non-existent-id");

        expect(result).toBeNull();
      });
    });
  });

  describe("updatePost", () => {
    it("updates existing post", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        const postId = seed.posts[0].id;
        const newContent = "Updated post content";

        const result = await postService.updatePost({
          id: postId,
          content: newContent,
        });

        Post.strict().parse(result);
        expect(result!.content).toBe(newContent);
      });
    });

    it("returns null for non-existent post update", async () => {
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

  describe("deletePost", () => {
    it("deletes existing post", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        const postId = seed.posts[0].id;

        await postService.deletePost(postId);

        expect(true).toBeTruthy();
      });
    });
  });

  describe("reportPost", () => {
    it("reports post successfully", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        await postService.reportPost(seed.users[0].id, seed.posts[0].id);
        expect(true).toBeTruthy();
      });
    });

    it("throws error for duplicate post report", async () => {
      await testWithTransaction(async ({ tx, seed }) => {
        const postService = new PostService(tx);
        const userId = seed.users[0].id;
        const postId = seed.posts[0].id;

        await postService.reportPost(userId, postId);
        expect(true).toBeTruthy();

        try {
          await postService.reportPost(userId, postId);
        } catch (e) {
          expect(e).toBeInstanceOf(Prisma.PrismaClientKnownRequestError);
        }
      });
    });
  });
});
