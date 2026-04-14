import { StatusCodes } from "http-status-codes";
import { PostControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import { handleMarkdownUpdate } from "@/utils/updatePost";
import { mockPostService, mockRequest, mockResponse } from "@tests/utils/mocks";

jest.mock("@/utils/updatePost");

describe("updatePost", () => {
  (handleMarkdownUpdate as jest.Mock).mockImplementation((a, b, c, d) => b);

  it("updates post successfully", async () => {
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
      user: { id: "user-id" } as UserWithCredentials,
      validated: {
        body: {
          content: "New updated content",
        },
        params: { id: "post-id" },
      },
    });
    const res = mockResponse();

    await PostControllers.updatePost(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
    expect(mockPostService.getPost).toHaveBeenCalledWith("post-id");
    expect(mockPostService.updatePost).toHaveBeenCalledWith({
      id: "post-id",
      content: "New updated content",
    });
  });

  it("returns 404 for non-existent post", async () => {
    mockPostService.getPost.mockResolvedValue(null);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
      validated: {
        body: {
          content: "New updated content",
        },
        params: { id: "post-id" },
      },
    });
    const res = mockResponse();

    await PostControllers.updatePost(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
  });

  it("returns 403 for unauthorized user", async () => {
    const post = {
      id: "post-id",
      content: "Post content.",
      author: { id: "bad-user-id" },
    };
    mockPostService.getPost.mockResolvedValue(post);

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
      validated: {
        body: {
          content: "New updated content",
        },
        params: { id: "post-id" },
      },
    });
    const res = mockResponse();

    await PostControllers.updatePost(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.FORBIDDEN);
  });

  it("passes errors to error middleware", async () => {
    const post = {
      id: "post-id",
      content: "Post content.",
      author: { id: "user-id" },
    };
    mockPostService.getPost.mockResolvedValue(post);
    mockPostService.updatePost.mockRejectedValue(new Error("Error"));
    const mockNextFunction = jest.fn();

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
      validated: {
        body: {
          content: "New updated content",
        },
        params: { id: "post-id" },
      },
    });
    const res = mockResponse();

    await PostControllers.updatePost(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
