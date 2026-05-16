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

describe("updatePost", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	(handleMarkdownUpdate as Mock).mockImplementation((_a, b, _c, _d) => b);

	it("updates post successfully", async () => {
		const post = {
			id: "post-id",
			content: "Updated post content.",
			author: { id: "user-id" },
		};
		mockPostService.getPost.mockResolvedValue(post);
		mockPostService.updatePost.mockResolvedValue({
			...post,
			content: "New updated content",
		});

		const req = mockRequest({
			user: { id: "user-id" } as UserWithCredentials,
			validated: {
				body: {
					content: "New updated content",
				},
				params: { id: "post-id" },
			},
		});
		const res = mockResponse();

		await PostControllers.updatePost(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
		expect(mockPostService.getPost).toHaveBeenCalledWith("post-id");
		expect(mockPostService.updatePost).toHaveBeenCalledWith({
			id: "post-id",
			content: "New updated content",
		});
	});

	it("returns 404 for non-existent post", async () => {
		mockPostService.getPost.mockResolvedValue(null);

		const req = mockRequest({
			user: { id: "user-id" } as UserWithCredentials,
			validated: {
				body: {
					content: "New updated content",
				},
				params: { id: "post-id" },
			},
		});
		const res = mockResponse();

		await PostControllers.updatePost(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.NOT_FOUND, expect.anything());
	});

	it("returns 403 for unauthorized user", async () => {
		const post = {
			id: "post-id",
			content: "Post content.",
			author: { id: "bad-user-id" },
		};
		mockPostService.getPost.mockResolvedValue(post);

		const req = mockRequest({
			user: { id: "user-id" } as UserWithCredentials,
			validated: {
				body: {
					content: "New updated content",
				},
				params: { id: "post-id" },
			},
		});
		const res = mockResponse();

		await PostControllers.updatePost(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.FORBIDDEN, expect.anything());
	});

	it("passes errors to error middleware", async () => {
		const post = {
			id: "post-id",
			content: "Post content.",
			author: { id: "user-id" },
		};
		mockPostService.getPost.mockResolvedValue(post);
		mockPostService.updatePost.mockRejectedValue(new Error("Error"));
		const mockNextFunction = vi.fn();

		const req = mockRequest({
			user: { id: "user-id" } as UserWithCredentials,
			validated: {
				body: {
					content: "New updated content",
				},
				params: { id: "post-id" },
			},
		});
		const res = mockResponse();

		await PostControllers.updatePost(req, res, mockNextFunction);

		expect(mockNextFunction).toHaveBeenCalled();
	});
});
