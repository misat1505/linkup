import { AuthControllers } from "@/controllers";
import { mockRequest, mockResponse, mockUserService } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
	buildValidatedResponder: vi.fn(() => respond),
}));

describe("signupUser", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("signs up new user successfully", async () => {
		mockUserService.isLoginTaken.mockResolvedValue(false);

		const req = mockRequest({
			validated: {
				body: {
					firstName: "John",
					lastName: "Doe",
					login: "john_doe",
					password: "password123",
				},
			},
		});
		const res = mockResponse();

		await AuthControllers.signup(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.CREATED, expect.anything());
		expect(res.cookie).toHaveBeenCalled();
	});

	it("fails for existing login", async () => {
		mockUserService.isLoginTaken.mockResolvedValue(true);

		const req = mockRequest({
			validated: {
				body: {
					firstName: "John",
					lastName: "Doe",
					login: "john_doe",
					password: "password123",
				},
			},
		});
		const res = mockResponse();

		await AuthControllers.signup(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.CONFLICT, expect.anything());
		expect(res.cookie).not.toHaveBeenCalled();
	});
});
