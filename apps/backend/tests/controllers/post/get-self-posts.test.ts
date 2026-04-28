import { PostControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { mockPostService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("getUserPosts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retrieves user's posts successfully", async () => {
    const posts = [{ id: "post-id-1", content: "User Post 1" }];
    mockPostService.getUserPosts.mockResolvedValue(posts);

    const req = mockRequest({ user: { id: "user-id" } as UserWithCredentials });
    const res = mockResponse();

    await PostControllers.getUserPosts(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    expect(mockPostService.getUserPosts).toHaveBeenCalledWith("user-id");
  });

  it("passes errors to error middleware", async () => {
    mockPostService.getUserPosts.mockRejectedValue(new Error("Error"));
    const mockNextFunction = vi.fn();

    const req = mockRequest({ user: { id: "user-id" } as UserWithCredentials });
    const res = mockResponse();

    await PostControllers.getUserPosts(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
