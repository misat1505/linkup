import { Prisma } from "@prisma/client";
import { PostControllers } from "../../../src/controllers";
import { mockPostService, mockRequest, mockResponse } from "../../utils/mocks";
import { UserWithCredentials } from "../../../src/types/User";

describe("reportPost", () => {
  const postId = "123";
  const userId = "user-id";

  it("reports post successfully", async () => {
    mockPostService.reportPost.mockResolvedValue(undefined);

    const req = mockRequest({
      user: { id: userId } as UserWithCredentials,
      validated: { params: { id: postId } },
    });
    const res = mockResponse();

    await PostControllers.reportPost(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);
    expect(mockPostService.reportPost).toHaveBeenCalledWith(userId, postId);
  });

  it("returns 409 for already reported post", async () => {
    mockPostService.reportPost.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint", {
        clientVersion: "4.0.0",
        code: "P2002",
      } as any)
    );

    const req = mockRequest({
      user: { id: userId } as UserWithCredentials,
      validated: { params: { id: postId } },
    });
    const res = mockResponse();

    await PostControllers.reportPost(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("passes errors to error middleware", async () => {
    mockPostService.reportPost.mockRejectedValue(new Error("Unexpected error"));
    const mockNextFunction = jest.fn();

    const req = mockRequest({
      user: { id: userId } as UserWithCredentials,
      validated: { params: { id: postId } },
    });
    const res = mockResponse();

    await PostControllers.reportPost(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
