import { PostControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import { mockPostService, mockRequest, mockResponse } from "../../utils/mocks";

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
      user: { id: "user-id" } as UserWithCredentials,
      validated: { params: { id: post.id } },
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
      user: { id: "user-id" } as UserWithCredentials,
      validated: { params: { id: "non-existent-id" } },
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
      user: { id: "user-id" } as UserWithCredentials,
      validated: { params: { id: unauthorizedPost.id } },
    });
    const res = mockResponse();

    await PostControllers.deletePost(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
  });
});
