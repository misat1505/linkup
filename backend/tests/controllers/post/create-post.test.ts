import { PostControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import { handleMarkdownUpdate } from "../../../src/utils/updatePost";
import { mockPostService, mockRequest, mockResponse } from "../../utils/mocks";

jest.mock("../../../src/utils/updatePost");

describe("createPost", () => {
  (handleMarkdownUpdate as jest.Mock).mockImplementation((a, b, c, d) => b);

  it("creates post successfully", async () => {
    const postContent = "This is a new post.";
    mockPostService.createPost.mockResolvedValue({
      id: "post-id",
      content: postContent,
      authorId: "user-id",
    });

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
      validated: { body: { content: postContent } },
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

  it("passes errors to error middleware", async () => {
    mockPostService.createPost.mockRejectedValue(new Error("Error"));
    const mockNextFunction = jest.fn();

    const req = mockRequest({
      user: { id: "user-id" } as UserWithCredentials,
      validated: {
        body: {
          content: "This is a new post.",
        },
      },
    });
    const res = mockResponse();

    await PostControllers.createPost(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalledTimes(1);
  });
});
