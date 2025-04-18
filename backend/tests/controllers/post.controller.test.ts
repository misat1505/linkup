import express, { NextFunction, Request, Response } from "express";
import request from "supertest";
import { PostService } from "../../src/services/PostService";
import { createPost } from "../../src/controllers/posts/createPost";
import { getPost } from "../../src/controllers/posts/getPost";
import { getPosts } from "../../src/controllers/posts/getPosts";
import { getUserPosts } from "../../src/controllers/posts/getUserPosts";
import { updatePost } from "../../src/controllers/posts/updatePost";
import { handleMarkdownUpdate } from "../../src/utils/updatePost";
import { deletePost } from "../../src/controllers/posts/deletePost";
import i18next from "../../src/i18n";
import middleware from "i18next-http-middleware";
import { PostRecommendationService } from "../../src/services/PostRecommendationService";
import { reportPost } from "../../src/controllers/posts/reportPost";
import { Prisma } from "@prisma/client";

jest.mock("../../src/lib/FileStorage");
jest.mock("../../src/services/PostService");
jest.mock("../../src/services/PostRecommendationService");
jest.mock("../../src/utils/updatePost");

const mockErrorMiddleware = jest.fn(
  (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send({ message: err.message });
  }
);

describe("Post controllers", () => {
  const app = express();
  app.use(express.json());
  app.use(middleware.handle(i18next));
  app.put("/posts/:id", updatePost);
  app.get("/posts/mine", getUserPosts);
  app.get("/posts/:id", getPost);
  app.get("/posts", getPosts);
  app.post("/posts", createPost);
  app.delete("/posts/:id", deletePost);
  app.post("/posts/:id/report", reportPost);
  app.use(mockErrorMiddleware);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  (handleMarkdownUpdate as jest.Mock).mockImplementation((a, b, c) => a);

  describe("createPost", () => {
    it("should successfully create a post", async () => {
      const postContent = "This is a new post.";
      (PostService.createPost as jest.Mock).mockResolvedValue({
        id: "post-id",
        content: postContent,
        authorId: "user-id",
      });

      const response = await request(app)
        .post("/posts")
        .send({
          content: postContent,
          token: { userId: "user-id" },
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        post: {
          id: "post-id",
          content: postContent,
          authorId: "user-id",
        },
      });
      expect(PostService.createPost).toHaveBeenCalledWith({
        content: postContent,
        authorId: "user-id",
        id: expect.any(String),
      });
    });

    it("should pass to error middleware if post creation fails", async () => {
      (PostService.createPost as jest.Mock).mockRejectedValue(
        new Error("Error")
      );

      await request(app)
        .post("/posts")
        .send({
          content: "This is a new post.",
          token: { userId: "user-id" },
        });

      expect(mockErrorMiddleware).toHaveBeenCalledTimes(1);
    });
  });

  describe("getPost", () => {
    it("should successfully retrieve a post by ID", async () => {
      const post = {
        id: "post-id",
        content: "This is a post.",
        authorId: "user-id",
      };

      (PostService.getPost as jest.Mock).mockResolvedValue(post);

      const response = await request(app).get("/posts/post-id");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ post });
      expect(PostService.getPost).toHaveBeenCalledWith("post-id");
    });

    it("should return a 404 error if post not found", async () => {
      (PostService.getPost as jest.Mock).mockResolvedValue(null);

      const response = await request(app).get("/posts/post-id");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Post not found." });
    });

    it("should pass to error middleware if post retrieval fails", async () => {
      (PostService.getPost as jest.Mock).mockRejectedValue(new Error("Error"));

      await request(app).get("/posts/post-id");

      expect(mockErrorMiddleware).toHaveBeenCalledTimes(1);
    });
  });

  describe("getPosts", () => {
    it("should successfully retrieve a list of posts", async () => {
      const posts = [
        { id: "post-id-1", content: "Post 1" },
        { id: "post-id-2", content: "Post 2" },
      ];
      (
        PostRecommendationService.getRecommendedPosts as jest.Mock
      ).mockResolvedValue(posts);

      const response = await request(app)
        .get("/posts")
        .send({ token: { userId: "user-id" } });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ posts });
      expect(PostRecommendationService.getRecommendedPosts).toHaveBeenCalled();
    });

    it("should return 400 if limit exceeds 10", async () => {
      const response = await request(app)
        .get("/posts?limit=20")
        .send({ token: { userId: "user-id" } });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        message: "Maximum limit is 10 - given 20",
      });
    });

    it("should successfully retrieve a list of posts with a valid limit and lastPostId", async () => {
      const posts = [
        { id: "post-id-1", content: "Post 1" },
        { id: "post-id-2", content: "Post 2" },
      ];
      (
        PostRecommendationService.getRecommendedPosts as jest.Mock
      ).mockResolvedValue(posts);

      const response = await request(app)
        .get("/posts?lastPostId=post-id-5&limit=5")
        .send({ token: { userId: "user-id" } });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ posts });
      expect(
        PostRecommendationService.getRecommendedPosts
      ).toHaveBeenCalledWith("user-id", "post-id-5", 5);
    });

    it("should pass to error middleware if post retrieval fails", async () => {
      (
        PostRecommendationService.getRecommendedPosts as jest.Mock
      ).mockRejectedValue(new Error("Error"));

      await request(app).get("/posts");

      expect(mockErrorMiddleware).toHaveBeenCalledTimes(1);
    });

    it("should handle invalid lastPostId", async () => {
      const posts = [
        { id: "post-id-1", content: "Post 1" },
        { id: "post-id-2", content: "Post 2" },
      ];
      (
        PostRecommendationService.getRecommendedPosts as jest.Mock
      ).mockResolvedValue(posts);

      const response = await request(app)
        .get("/posts?lastPostId=invalid-id&limit=5")
        .send({ token: { userId: "user-id" } });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ posts });
      expect(
        PostRecommendationService.getRecommendedPosts
      ).toHaveBeenCalledWith("user-id", "invalid-id", 5);
    });

    it("should handle missing or invalid limit query parameter", async () => {
      const posts = [
        { id: "post-id-1", content: "Post 1" },
        { id: "post-id-2", content: "Post 2" },
      ];
      (
        PostRecommendationService.getRecommendedPosts as jest.Mock
      ).mockResolvedValue(posts);

      const response = await request(app)
        .get("/posts?limit=invalid")
        .send({ token: { userId: "user-id" } });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ posts });
      expect(
        PostRecommendationService.getRecommendedPosts
      ).toHaveBeenCalledWith("user-id", null, 10);
    });

    it("should return null for lastPostId if 'null' is passed as query", async () => {
      const posts = [
        { id: "post-id-1", content: "Post 1" },
        { id: "post-id-2", content: "Post 2" },
      ];
      (
        PostRecommendationService.getRecommendedPosts as jest.Mock
      ).mockResolvedValue(posts);

      const response = await request(app)
        .get("/posts?lastPostId=null&limit=5")
        .send({ token: { userId: "user-id" } });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ posts });
      expect(
        PostRecommendationService.getRecommendedPosts
      ).toHaveBeenCalledWith("user-id", null, 5);
    });
  });

  describe("getUserPosts", () => {
    it("should successfully retrieve user's posts", async () => {
      const posts = [{ id: "post-id-1", content: "User Post 1" }];
      (PostService.getUserPosts as jest.Mock).mockResolvedValue(posts);

      const response = await request(app)
        .get("/posts/mine")
        .send({
          token: { userId: "user-id" },
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ posts });
      expect(PostService.getUserPosts).toHaveBeenCalledWith("user-id");
    });

    it("should pass to error middleware if user post retrieval fails", async () => {
      (PostService.getUserPosts as jest.Mock).mockRejectedValue(
        new Error("Error")
      );

      await request(app)
        .get("/posts/mine")
        .send({
          token: { userId: "user-id" },
        });

      expect(mockErrorMiddleware).toHaveBeenCalledTimes(1);
    });
  });

  describe("updatePost", () => {
    it("should successfully update a post", async () => {
      const post = {
        id: "post-id",
        content: "Updated post content.",
        author: { id: "user-id" },
      };
      (PostService.getPost as jest.Mock).mockResolvedValue(post);
      (PostService.updatePost as jest.Mock).mockResolvedValue({
        ...post,
        content: "New updated content",
      });

      const response = await request(app)
        .put("/posts/post-id")
        .send({
          content: "New updated content",
          token: { userId: "user-id" },
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        post: {
          id: "post-id",
          content: "New updated content",
          author: { id: "user-id" },
        },
      });
      expect(PostService.getPost).toHaveBeenCalledWith("post-id");
      expect(PostService.updatePost).toHaveBeenCalledWith({
        id: "post-id",
        content: "New updated content",
      });
    });

    it("should return a 404 error if post not found", async () => {
      (PostService.getPost as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put("/posts/post-id")
        .send({
          content: "New content",
          token: { userId: "user-id" },
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Post not found." });
    });

    it("should return a 401 error if user is not authorized to update the post", async () => {
      const post = {
        id: "post-id",
        content: "Post content.",
        author: { id: "bad-user-id" },
      };
      (PostService.getPost as jest.Mock).mockResolvedValue(post);

      const response = await request(app)
        .put("/posts/post-id")
        .send({
          content: "New content",
          token: { userId: "user-id" },
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Cannot edit post not belonging to you.",
      });
    });

    it("should pass to error middleware if post update fails", async () => {
      const post = {
        id: "post-id",
        content: "Post content.",
        author: { id: "user-id" },
      };
      (PostService.getPost as jest.Mock).mockResolvedValue(post);
      (PostService.updatePost as jest.Mock).mockRejectedValue(
        new Error("Error")
      );

      await request(app)
        .put("/posts/post-id")
        .send({
          content: "New content",
          token: { userId: "user-id" },
        });

      expect(mockErrorMiddleware).toHaveBeenCalledTimes(1);
    });
  });

  describe("deletePost", () => {
    it("should successfully delete a post", async () => {
      const post = {
        id: "post-id",
        content: "Post content.",
        author: { id: "user-id" },
        chat: { id: "chat-id" },
      };
      (PostService.getPost as jest.Mock).mockResolvedValue(post);
      (PostService.deletePost as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .delete(`/posts/${post.id}`)
        .send({
          token: { userId: "user-id" },
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Post deleted successfully." });
      expect(PostService.getPost).toHaveBeenCalledWith(post.id);
      expect(PostService.deletePost).toHaveBeenCalledWith(post.id);
    });

    it("should return a 404 error if post not found", async () => {
      (PostService.getPost as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete("/posts/non-existent-id")
        .send({
          token: { userId: "user-id" },
        });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Post not found." });
    });

    it("should return a 401 error if user is not authorized to delete the post", async () => {
      const unauthorizedPost = {
        id: "post-id",
        content: "Post content.",
        author: { id: "another-user-id" },
      };
      (PostService.getPost as jest.Mock).mockResolvedValue(unauthorizedPost);

      const response = await request(app)
        .delete(`/posts/${unauthorizedPost.id}`)
        .send({
          token: { userId: "user-id" },
        });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        message: "Cannot delete post not belonging to you.",
      });
    });
  });

  describe("reportPost", () => {
    const postId = "123";
    const userId = "user-id";

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should successfully report a post", async () => {
      (PostService.reportPost as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .post(`/posts/${postId}/report`)
        .send({ token: { userId } });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Post reported successfully.");
      expect(PostService.reportPost).toHaveBeenCalledWith(userId, postId);
    });

    it("should return 409 if post is already reported", async () => {
      (PostService.reportPost as jest.Mock).mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError("Unique constraint", {
          clientVersion: "4.0.0",
          code: "P2002",
        } as any)
      );

      const response = await request(app)
        .post(`/posts/${postId}/report`)
        .send({ token: { userId } });

      expect(response.status).toBe(409);
      expect(response.body.message).toBe(
        "This post had been previously reported by you."
      );
    });

    it("should pass to error middleware if reporting fails for another reason", async () => {
      const error = new Error("Unexpected error");
      (PostService.reportPost as jest.Mock).mockRejectedValue(error);

      await request(app)
        .post(`/posts/${postId}/report`)
        .send({ token: { userId } });

      expect(mockErrorMiddleware).toHaveBeenCalledTimes(1);
      expect(mockErrorMiddleware).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.any(String),
        }),
        expect.anything(),
        expect.anything(),
        expect.anything()
      );
    });
  });
});
