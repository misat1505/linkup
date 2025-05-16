import { StatusCodes } from "http-status-codes";
import { PostControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import { mockPostService, mockRequest, mockResponse } from "../../utils/mocks";

describe("deletePost", () => {
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

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
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

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
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

    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
  });
});
