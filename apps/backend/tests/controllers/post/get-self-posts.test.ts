import { PostControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { mockPostService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("getUserPosts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retrieves user's posts successfully", async () => {
    const posts = [{ id: "post-id-1", content: "User Post 1" }];
    mockPostService.getUserPosts.mockResolvedValue(posts);

    const req = mockRequest({ user: { id: "user-id" } as UserWithCredentials });
    const res = mockResponse();

    await PostControllers.getUserPosts(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    expect(mockPostService.getUserPosts).toHaveBeenCalledWith("user-id");
  });

  it("passes errors to error middleware", async () => {
    mockPostService.getUserPosts.mockRejectedValue(new Error("Error"));
    const mockNextFunction = jest.fn();

    const req = mockRequest({ user: { id: "user-id" } as UserWithCredentials });
    const res = mockResponse();

    await PostControllers.getUserPosts(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
