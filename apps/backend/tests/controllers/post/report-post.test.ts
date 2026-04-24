import { PostControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import { Prisma } from "@prisma/client";
import { mockPostService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("reportPost", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    expect(mockPostService.reportPost).toHaveBeenCalledWith(userId, postId);
  });

  it("returns 409 for already reported post", async () => {
    mockPostService.reportPost.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint", {
        clientVersion: "4.0.0",
        code: "P2002",
      }),
    );

    const req = mockRequest({
      user: { id: userId } as UserWithCredentials,
      validated: { params: { id: postId } },
    });
    const res = mockResponse();

    await PostControllers.reportPost(req, res, jest.fn());

    expect(respond).toHaveBeenCalledWith(
      StatusCodes.CONFLICT,
      expect.anything(),
    );
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
