import { PostControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { mockPostService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("deletePost", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes post successfully", async () => {
    const post = {
      id: "post-id",
      content: "Post content.",
      author: { id: "user-id" },
      chat: { id: "chat-id" },
    };
    mockPostService.getPost.mockResolvedValue(post);
    mockPostService.deletePost.mockResolvedValue(true);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
      validated: { params: { id: post.id } },
    });
    const res = mockResponse();

    await PostControllers.deletePost(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    expect(mockPostService.getPost).toHaveBeenCalledWith(post.id);
    expect(mockPostService.deletePost).toHaveBeenCalledWith(post.id);
  });

  it("returns 404 for non-existent post", async () => {
    (mockPostService.getPost as jest.Mock).mockResolvedValue(null);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
      validated: { params: { id: "non-existent-id" } },
    });
    const res = mockResponse();

    await PostControllers.deletePost(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.NOT_FOUND,
      expect.anything(),
    );
  });

  it("returns 403 for unauthorized user", async () => {
    const unauthorizedPost = {
      id: "post-id",
      content: "Post content.",
      author: { id: "another-user-id" },
    };
    mockPostService.getPost.mockResolvedValue(unauthorizedPost);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
      validated: { params: { id: unauthorizedPost.id } },
    });
    const res = mockResponse();

    await PostControllers.deletePost(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.FORBIDDEN,
      expect.anything(),
    );
  });
});
