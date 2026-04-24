import { PostControllers } from "@/controllers";
import { mockPostService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("getPost", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    await PostControllers.getPost(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    expect(mockPostService.getPost).toHaveBeenCalledWith(post.id);
  });

  it("returns 404 for non-existent post", async () => {
    mockPostService.getPost.mockResolvedValue(null);

    const req = mockRequest({
      validated: { params: { id: "post-id" } },
    });
    const res = mockResponse();

    await PostControllers.getPost(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.NOT_FOUND,
      expect.anything(),
    );
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
