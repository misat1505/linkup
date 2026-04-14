import { StatusCodes } from "http-status-codes";
import { PostControllers } from "@/controllers";
import { mockPostService, mockRequest, mockResponse } from "@tests/utils/mocks";

describe("getPost", () => {
  it("retrieves post by ID successfully", async () => {
    const post = {
      id: "post-id",
      content: "This is a post.",
      authorId: "user-id",
    };
    mockPostService.getPost.mockResolvedValue(post);

    const req = mockRequest({
      validated: { params: { id: post.id } },
    });
    const res = mockResponse();

    await PostControllers.getPost(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockPostService.getPost).toHaveBeenCalledWith(post.id);
  });

  it("returns 404 for non-existent post", async () => {
    mockPostService.getPost.mockResolvedValue(null);

    const req = mockRequest({
      validated: { params: { id: "post-id" } },
    });
    const res = mockResponse();

    await PostControllers.getPost(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it("passes errors to error middleware", async () => {
    mockPostService.getPost.mockRejectedValue(new Error("Error"));
    const mockNextFunction = jest.fn();

    const req = mockRequest({
      validated: { params: { id: "post-id" } },
    });
    const res = mockResponse();

    await PostControllers.getPost(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
