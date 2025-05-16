import { StatusCodes } from "http-status-codes";
import { PostControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import { mockPostService, mockRequest, mockResponse } from "@tests/utils/mocks";

describe("getUserPosts", () => {
  it("retrieves user’s posts successfully", async () => {
    const posts = [{ id: "post-id-1", content: "User Post 1" }];
    mockPostService.getUserPosts.mockResolvedValue(posts);

    const req = mockRequest({ user: { id: "user-id" } as UserWithCredentials });
    const res = mockResponse();

    await PostControllers.getUserPosts(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
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
