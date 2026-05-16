import { PostControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/user-with-credentials";
import { mockPostRecommendationService, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
	buildValidatedResponder: vi.fn(() => respond),
}));

describe("getPosts", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("retrieves list of posts successfully", async () => {
		const posts = [
			{ id: "post-id-1", content: "Post 1" },
			{ id: "post-id-2", content: "Post 2" },
		];
		mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(posts);

		const req = mockRequest({
			user: { id: "user-id" } as UserWithCredentials,
			validated: { query: {} },
		});
		const res = mockResponse();

		await PostControllers.getPosts(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
		expect(mockPostRecommendationService.getRecommendedPosts).toHaveBeenCalled();
	});

	it("retrieves posts with valid limit and lastPostId", async () => {
		const posts = [
			{ id: "post-id-1", content: "Post 1" },
			{ id: "post-id-2", content: "Post 2" },
		];
		mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(posts);

		const req = mockRequest({
			user: { id: "user-id" } as UserWithCredentials,
			validated: { query: { lastPostId: "post-id-5", limit: 5 } },
		});
		const res = mockResponse();

		await PostControllers.getPosts(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
		expect(mockPostRecommendationService.getRecommendedPosts).toHaveBeenCalledWith(
			"user-id",
			"post-id-5",
			5,
		);
	});

	it("passes errors to error middleware", async () => {
		mockPostRecommendationService.getRecommendedPosts.mockRejectedValue(new Error("Error"));
		const mockNextFunction = vi.fn();

		const req = mockRequest({
			user: { id: "user-id" } as UserWithCredentials,
			validated: { query: {} },
		});
		const res = mockResponse();

		await PostControllers.getPosts(req, res, mockNextFunction);

		expect(mockNextFunction).toHaveBeenCalled();
	});

	it("handles null lastPostId query", async () => {
		const posts = [
			{ id: "post-id-1", content: "Post 1" },
			{ id: "post-id-2", content: "Post 2" },
		];
		mockPostRecommendationService.getRecommendedPosts.mockResolvedValue(posts);

		const req = mockRequest({
			user: { id: "user-id" } as UserWithCredentials,
			validated: { query: { lastPostId: null, limit: 5 } },
		});
		const res = mockResponse();

		await PostControllers.getPosts(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
		expect(mockPostRecommendationService.getRecommendedPosts).toHaveBeenCalledWith(
			"user-id",
			null,
			5,
		);
	});
});
