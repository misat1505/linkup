import { PostControllers } from "../../../src/controllers";
import { handleMarkdownUpdate } from "../../../src/utils/updatePost";
import { mockPostService, mockRequest, mockResponse } from "../../utils/mocks";

jest.mock("../../../src/utils/updatePost");

describe("updatePost", () => {
  (handleMarkdownUpdate as jest.Mock).mockImplementation((a, b, c, d) => b);

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
