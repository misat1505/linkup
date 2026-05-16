import { PostControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/user-with-credentials";
import { Prisma } from "@prisma/client";
import { mockPostService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
	buildValidatedResponder: vi.fn(() => respond),
}));

describe("reportPost", () => {
	beforeEach(() => {
		vi.clearAllMocks();
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

		await PostControllers.reportPost(req, res, vi.fn());

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

		await PostControllers.reportPost(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.CONFLICT, expect.anything());
	});

	it("passes errors to error middleware", async () => {
		mockPostService.reportPost.mockRejectedValue(new Error("Unexpected error"));
		const mockNextFunction = vi.fn();

		const req = mockRequest({
			user: { id: userId } as UserWithCredentials,
			validated: { params: { id: postId } },
		});
		const res = mockResponse();

		await PostControllers.reportPost(req, res, mockNextFunction);

		expect(mockNextFunction).toHaveBeenCalled();
	});
});
