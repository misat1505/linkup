import { PostControllers } from "../../../src/controllers";
import { mockPostService, mockRequest, mockResponse } from "../../utils/mocks";

describe("getUserPosts", () => {
  it("should successfully retrieve user's posts", async () => {
    const posts = [{ id: "post-id-1", content: "User Post 1" }];
    mockPostService.getUserPosts.mockResolvedValue(posts);

    const req = mockRequest({
      body: { token: { userId: "user-id" } },
    });
    const res = mockResponse();

    await PostControllers.getUserPosts(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockPostService.getUserPosts).toHaveBeenCalledWith("user-id");
  });

  it("should pass to error middleware if user post retrieval fails", async () => {
    mockPostService.getUserPosts.mockRejectedValue(new Error("Error"));
    const mockNextFunction = jest.fn();

    const req = mockRequest({
      body: { token: { userId: "user-id" } },
    });
    const res = mockResponse();

    await PostControllers.getUserPosts(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
