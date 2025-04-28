import { PostControllers } from "../../../src/controllers";
import { handleMarkdownUpdate } from "../../../src/utils/updatePost";
import { mockPostService, mockRequest, mockResponse } from "../../utils/mocks";

jest.mock("../../../src/utils/updatePost");

describe("createPost", () => {
  (handleMarkdownUpdate as jest.Mock).mockImplementation((a, b, c, d) => b);

  it("should successfully create a post", async () => {
    const postContent = "This is a new post.";
    mockPostService.createPost.mockResolvedValue({
      id: "post-id",
      content: postContent,
      authorId: "user-id",
    });

    const req = mockRequest({
      body: { content: postContent, token: { userId: "user-id" } },
    });
    const res = mockResponse();

    await PostControllers.createPost(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(201);
    expect(mockPostService.createPost).toHaveBeenCalledWith({
      content: postContent,
      authorId: "user-id",
      id: expect.any(String),
    });
  });

  it("should pass to error middleware if post creation fails", async () => {
    mockPostService.createPost.mockRejectedValue(new Error("Error"));
    const mockNextFunction = jest.fn();

    const req = mockRequest({
      body: {
        content: "This is a new post.",
        token: { userId: "user-id" },
      },
    });
    const res = mockResponse();

    await PostControllers.createPost(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledTimes(1);
  });
});
