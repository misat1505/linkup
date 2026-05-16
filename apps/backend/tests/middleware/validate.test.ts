import { validate } from "@/middlewares/validate";
import { StatusCodes } from "http-status-codes";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { mockRequest, mockResponse } from "../utils/mocks";

describe("validate middleware", () => {
	const UserDTO = z
		.object({
			name: z.string(),
		})
		.strict();
	type UserDTO = z.infer<typeof UserDTO>;

	const mockNextFunction = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("proceeds to next function on successful validation", async () => {
		const middleware = validate({ body: UserDTO });

		const req = mockRequest({ body: { name: "Bob" } });
		const res = mockResponse();

		await middleware(req, res, mockNextFunction);

		expect(mockNextFunction).toHaveBeenCalled();
	});

	it("returns errors on failed validation", async () => {
		const middleware = validate({ body: UserDTO });

		const req = mockRequest({ body: {} });
		const res = mockResponse();

		await middleware(req, res, mockNextFunction);

		expect(res.status).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST);
		expect(mockNextFunction).not.toHaveBeenCalled();
	});
});
