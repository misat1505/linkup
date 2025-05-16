import { StatusCodes } from "http-status-codes";
import { PostControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import {
  mockPostRecommendationService,
  mockRequest,
  mockResponse,
} from "@tests/utils/mocks";

describe("getPosts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retrieves list of posts successfully", async () => {
    const posts = [
      { id: "post-id-1", content: "Post 1" },
      { id: "post-id-2", content: "Post 2" },
    ];
    mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(posts);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
      validated: { query: {} },
    });
    const res = mockResponse();

    await PostControllers.getPosts(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(
      mockPostRecommendationService.getRecommendedPosts
    ).toHaveBeenCalled();
  });

  it("retrieves posts with valid limit and lastPostId", async () => {
    const posts = [
      { id: "post-id-1", content: "Post 1" },
      { id: "post-id-2", content: "Post 2" },
    ];
    mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(posts);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
      validated: { query: { lastPostId: "post-id-5", limit: 5 } },
    });
    const res = mockResponse();

    await PostControllers.getPosts(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(
      mockPostRecommendationService.getRecommendedPosts
    ).toHaveBeenCalledWith("user-id", "post-id-5", 5);
  });

  it("passes errors to error middleware", async () => {
    mockPostRecommendationService.getRecommendedPosts.mockRejectedValue(
      new Error("Error")
    );
    const mockNextFunction = jest.fn();

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
      validated: { query: {} },
    });
    const res = mockResponse();

    await PostControllers.getPosts(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });

  it("handles null lastPostId query", async () => {
    const posts = [
      { id: "post-id-1", content: "Post 1" },
      { id: "post-id-2", content: "Post 2" },
    ];
    mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(posts);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
      validated: { query: { lastPostId: null, limit: 5 } },
    });
    const res = mockResponse();

    await PostControllers.getPosts(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(
      mockPostRecommendationService.getRecommendedPosts
    ).toHaveBeenCalledWith("user-id", null, 5);
  });
});
