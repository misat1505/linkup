import { PostControllers } from "../../../src/controllers";
import { mockPostService, mockRequest, mockResponse } from "../../utils/mocks";

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
