import { PostControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import { mockPostService, mockRequest, mockResponse } from "../../utils/mocks";

describe("getUserPosts", () => {
  it("should successfully retrieve user's posts", async () => {
    const posts = [{ id: "post-id-1", content: "User Post 1" }];
    mockPostService.getUserPosts.mockResolvedValue(posts);

    const req = mockRequest({ user: { id: "user-id" } as UserWithCredentials });
    const res = mockResponse();

    await PostControllers.getUserPosts(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockPostService.getUserPosts).toHaveBeenCalledWith("user-id");
  });

  it("should pass to error middleware if user post retrieval fails", async () => {
    mockPostService.getUserPosts.mockRejectedValue(new Error("Error"));
    const mockNextFunction = jest.fn();

    const req = mockRequest({ user: { id: "user-id" } as UserWithCredentials });
    const res = mockResponse();

    await PostControllers.getUserPosts(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
