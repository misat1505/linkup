import { PostControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import {
  mockPostRecommendationService,
  mockRequest,
  mockResponse,
} from "../../utils/mocks";

describe("getPosts", () => {
  it("should successfully retrieve a list of posts", async () => {
    const posts = [
      { id: "post-id-1", content: "Post 1" },
      { id: "post-id-2", content: "Post 2" },
    ];
    mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(posts);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
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
      user: { id: "user-id" } as UserWithCredentials,
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
    mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(posts);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
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
      user: { id: "user-id" } as UserWithCredentials,
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
    mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(posts);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
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
    mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(posts);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
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
    mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(posts);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
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
