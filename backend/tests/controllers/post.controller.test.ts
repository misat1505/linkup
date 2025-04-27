import { handleMarkdownUpdate } from "../../src/utils/updatePost";
import { Prisma } from "@prisma/client";
import {
  mockPostRecommendationService,
  mockPostService,
  mockRequest,
  mockResponse,
} from "../utils/mocks";
import { PostControllers } from "../../src/controllers";

jest.mock("../../src/utils/updatePost");

describe("Post controllers", () => {
  (handleMarkdownUpdate as jest.Mock).mockImplementation((a, b, c, d) => b);

  describe("createPost", () => {
    it("should successfully create a post", async () => {
      const postContent = "This is a new post.";
      mockPostService.createPost.mockResolvedValue({
        id: "post-id",
        content: postContent,
        authorId: "user-id",
      });

      const req = mockRequest({
        body: { content: postContent, token: { userId: "user-id" } },
      });
      const res = mockResponse();

      await PostControllers.createPost(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockPostService.createPost).toHaveBeenCalledWith({
        content: postContent,
        authorId: "user-id",
        id: expect.any(String),
      });
    });

    it("should pass to error middleware if post creation fails", async () => {
      mockPostService.createPost.mockRejectedValue(new Error("Error"));
      const mockNextFunction = jest.fn();

      const req = mockRequest({
        body: {
          content: "This is a new post.",
          token: { userId: "user-id" },
        },
      });
      const res = mockResponse();

      await PostControllers.createPost(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalledTimes(1);
    });
  });

  describe("getPost", () => {
    it("should successfully retrieve a post by ID", async () => {
      const post = {
        id: "post-id",
        content: "This is a post.",
        authorId: "user-id",
      };
      mockPostService.getPost.mockResolvedValue(post);

      const req = mockRequest({
        params: { id: post.id },
      });
      const res = mockResponse();

      await PostControllers.getPost(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockPostService.getPost).toHaveBeenCalledWith(post.id);
    });

    it("should return a 404 error if post not found", async () => {
      mockPostService.getPost.mockResolvedValue(null);

      const req = mockRequest({
        params: { id: "post-id" },
      });
      const res = mockResponse();

      await PostControllers.getPost(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should pass to error middleware if post retrieval fails", async () => {
      mockPostService.getPost.mockRejectedValue(new Error("Error"));
      const mockNextFunction = jest.fn();

      const req = mockRequest({
        params: { id: "post-id" },
      });
      const res = mockResponse();

      await PostControllers.getPost(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });
  });

  describe("getPosts", () => {
    it("should successfully retrieve a list of posts", async () => {
      const posts = [
        { id: "post-id-1", content: "Post 1" },
        { id: "post-id-2", content: "Post 2" },
      ];
      mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(
        posts
      );

      const req = mockRequest({
        body: { token: { userId: "user-id" } },
        query: {},
      });
      const res = mockResponse();

      await PostControllers.getPosts(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(
        mockPostRecommendationService.getRecommendedPosts
      ).toHaveBeenCalled();
    });

    it("should return 400 if limit exceeds 10", async () => {
      const req = mockRequest({
        body: { token: { userId: "user-id" } },
        query: { limit: "20" },
      });
      const res = mockResponse();

      await PostControllers.getPosts(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should successfully retrieve a list of posts with a valid limit and lastPostId", async () => {
      const posts = [
        { id: "post-id-1", content: "Post 1" },
        { id: "post-id-2", content: "Post 2" },
      ];
      mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(
        posts
      );

      const req = mockRequest({
        body: { token: { userId: "user-id" } },
        query: { lastPostId: "post-id-5", limit: "5" },
      });
      const res = mockResponse();

      await PostControllers.getPosts(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(
        mockPostRecommendationService.getRecommendedPosts
      ).toHaveBeenCalledWith("user-id", "post-id-5", 5);
    });

    it("should pass to error middleware if post retrieval fails", async () => {
      mockPostRecommendationService.getRecommendedPosts.mockRejectedValue(
        new Error("Error")
      );
      const mockNextFunction = jest.fn();

      const req = mockRequest({
        body: { token: { userId: "user-id" } },
        query: {},
      });
      const res = mockResponse();

      await PostControllers.getPosts(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });

    it("should handle invalid lastPostId", async () => {
      const posts = [
        { id: "post-id-1", content: "Post 1" },
        { id: "post-id-2", content: "Post 2" },
      ];
      mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(
        posts
      );

      const req = mockRequest({
        body: { token: { userId: "user-id" } },
        query: { lastPostId: "invalid-id", limit: "5" },
      });
      const res = mockResponse();

      await PostControllers.getPosts(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(
        mockPostRecommendationService.getRecommendedPosts
      ).toHaveBeenCalledWith("user-id", "invalid-id", 5);
    });

    it("should handle missing or invalid limit query parameter", async () => {
      const posts = [
        { id: "post-id-1", content: "Post 1" },
        { id: "post-id-2", content: "Post 2" },
      ];
      mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(
        posts
      );

      const req = mockRequest({
        body: { token: { userId: "user-id" } },
        query: { limit: "invalid" },
      });
      const res = mockResponse();

      await PostControllers.getPosts(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(
        mockPostRecommendationService.getRecommendedPosts
      ).toHaveBeenCalledWith("user-id", null, 10);
    });

    it("should return null for lastPostId if 'null' is passed as query", async () => {
      const posts = [
        { id: "post-id-1", content: "Post 1" },
        { id: "post-id-2", content: "Post 2" },
      ];
      mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(
        posts
      );

      const req = mockRequest({
        body: { token: { userId: "user-id" } },
        query: { lastPostId: "null", limit: "5" },
      });
      const res = mockResponse();

      await PostControllers.getPosts(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(
        mockPostRecommendationService.getRecommendedPosts
      ).toHaveBeenCalledWith("user-id", null, 5);
    });
  });

  describe("getUserPosts", () => {
    it("should successfully retrieve user's posts", async () => {
      const posts = [{ id: "post-id-1", content: "User Post 1" }];
      mockPostService.getUserPosts.mockResolvedValue(posts);

      const req = mockRequest({
        body: { token: { userId: "user-id" } },
      });
      const res = mockResponse();

      await PostControllers.getUserPosts(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockPostService.getUserPosts).toHaveBeenCalledWith("user-id");
    });

    it("should pass to error middleware if user post retrieval fails", async () => {
      mockPostService.getUserPosts.mockRejectedValue(new Error("Error"));
      const mockNextFunction = jest.fn();

      const req = mockRequest({
        body: { token: { userId: "user-id" } },
      });
      const res = mockResponse();

      await PostControllers.getUserPosts(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });
  });

  describe("updatePost", () => {
    it("should successfully update a post", async () => {
      const post = {
        id: "post-id",
        content: "Updated post content.",
        author: { id: "user-id" },
      };
      mockPostService.getPost.mockResolvedValue(post);
      mockPostService.updatePost.mockResolvedValue({
        ...post,
        content: "New updated content",
      });

      const req = mockRequest({
        body: {
          content: "New updated content",
          token: { userId: "user-id" },
        },
        params: { id: "post-id" },
      });
      const res = mockResponse();

      await PostControllers.updatePost(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockPostService.getPost).toHaveBeenCalledWith("post-id");
      expect(mockPostService.updatePost).toHaveBeenCalledWith({
        id: "post-id",
        content: "New updated content",
      });
    });

    it("should return a 404 error if post not found", async () => {
      mockPostService.getPost.mockResolvedValue(null);

      const req = mockRequest({
        body: {
          content: "New updated content",
          token: { userId: "user-id" },
        },
        params: { id: "post-id" },
      });
      const res = mockResponse();

      await PostControllers.updatePost(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return a 401 error if user is not authorized to update the post", async () => {
      const post = {
        id: "post-id",
        content: "Post content.",
        author: { id: "bad-user-id" },
      };
      mockPostService.getPost.mockResolvedValue(post);

      const req = mockRequest({
        body: {
          content: "New updated content",
          token: { userId: "user-id" },
        },
        params: { id: "post-id" },
      });
      const res = mockResponse();

      await PostControllers.updatePost(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should pass to error middleware if post update fails", async () => {
      const post = {
        id: "post-id",
        content: "Post content.",
        author: { id: "user-id" },
      };
      mockPostService.getPost.mockResolvedValue(post);
      mockPostService.updatePost.mockRejectedValue(new Error("Error"));
      const mockNextFunction = jest.fn();

      const req = mockRequest({
        body: {
          content: "New updated content",
          token: { userId: "user-id" },
        },
        params: { id: "post-id" },
      });
      const res = mockResponse();

      await PostControllers.updatePost(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
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
      mockPostService.getPost.mockResolvedValue(post);
      mockPostService.deletePost.mockResolvedValue(true);

      const req = mockRequest({
        body: {
          token: { userId: "user-id" },
        },
        params: { id: post.id },
      });
      const res = mockResponse();

      await PostControllers.deletePost(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockPostService.getPost).toHaveBeenCalledWith(post.id);
      expect(mockPostService.deletePost).toHaveBeenCalledWith(post.id);
    });

    it("should return a 404 error if post not found", async () => {
      (mockPostService.getPost as jest.Mock).mockResolvedValue(null);

      const req = mockRequest({
        body: {
          token: { userId: "user-id" },
        },
        params: { id: "non-existent-id" },
      });
      const res = mockResponse();

      await PostControllers.deletePost(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it("should return a 401 error if user is not authorized to delete the post", async () => {
      const unauthorizedPost = {
        id: "post-id",
        content: "Post content.",
        author: { id: "another-user-id" },
      };
      mockPostService.getPost.mockResolvedValue(unauthorizedPost);

      const req = mockRequest({
        body: {
          token: { userId: "user-id" },
        },
        params: { id: unauthorizedPost.id },
      });
      const res = mockResponse();

      await PostControllers.deletePost(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  describe("reportPost", () => {
    const postId = "123";
    const userId = "user-id";

    it("should successfully report a post", async () => {
      mockPostService.reportPost.mockResolvedValue(undefined);

      const req = mockRequest({
        body: { token: { userId } },
        params: { id: postId },
      });
      const res = mockResponse();

      await PostControllers.reportPost(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);
      expect(mockPostService.reportPost).toHaveBeenCalledWith(userId, postId);
    });

    it("should return 409 if post is already reported", async () => {
      mockPostService.reportPost.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError("Unique constraint", {
          clientVersion: "4.0.0",
          code: "P2002",
        } as any)
      );

      const req = mockRequest({
        body: { token: { userId } },
        params: { id: postId },
      });
      const res = mockResponse();

      await PostControllers.reportPost(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(409);
    });

    it("should pass to error middleware if reporting fails for another reason", async () => {
      mockPostService.reportPost.mockRejectedValue(
        new Error("Unexpected error")
      );
      const mockNextFunction = jest.fn();

      const req = mockRequest({
        body: { token: { userId } },
        params: { id: postId },
      });
      const res = mockResponse();

      await PostControllers.reportPost(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });
  });
});
