import { PostControllers } from "@/controllers";
import { mockPostService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("getPost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

    await PostControllers.getPost(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    expect(mockPostService.getPost).toHaveBeenCalledWith(post.id);
  });

  it("returns 404 for non-existent post", async () => {
    mockPostService.getPost.mockResolvedValue(null);

    const req = mockRequest({
      validated: { params: { id: "post-id" } },
    });
    const res = mockResponse();

    await PostControllers.getPost(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.NOT_FOUND,
      expect.anything(),
    );
  });

  it("passes errors to error middleware", async () => {
    mockPostService.getPost.mockRejectedValue(new Error("Error"));
    const mockNextFunction = vi.fn();

    const req = mockRequest({
      validated: { params: { id: "post-id" } },
    });
    const res = mockResponse();

    await PostControllers.getPost(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
