import { PostControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/user-with-credentials";
import { handleMarkdownUpdate } from "@/utils/update-post";
import { mockPostService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/utils/update-post");

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
	buildValidatedResponder: vi.fn(() => respond),
}));

describe("createPost", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	(handleMarkdownUpdate as Mock).mockImplementation((_a, b, _c, _d) => b);

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

		await PostControllers.createPost(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.CREATED, expect.anything());
		expect(mockPostService.createPost).toHaveBeenCalledWith({
			content: postContent,
			authorId: "user-id",
			id: expect.any(String),
		});
	});

	it("passes errors to error middleware", async () => {
		mockPostService.createPost.mockRejectedValue(new Error("Error"));
		const mockNextFunction = vi.fn();

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
