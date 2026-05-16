import { FileControllers } from "@/controllers";
import { CACHE_CAPACITY } from "@/controllers/file/insert-to-cache.controller";
import { UserWithCredentials } from "@/types/user-with-credentials";
import { mockFileService, mockFileStorage, mockRequest, mockResponse } from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { afterEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validated-responder", () => ({
	buildValidatedResponder: vi.fn(() => respond),
}));

describe("insertToCache", () => {
	mockFileService.isUserAvatar.mockResolvedValue(true);
	mockFileService.isChatMessage.mockResolvedValue(true);
	mockFileService.isChatPhoto.mockResolvedValue(true);

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("inserts file to cache with new filename", async () => {
		mockFileStorage.listFiles.mockResolvedValue([]);
		mockFileStorage.uploadFile.mockResolvedValue("new-file.jpg");

		const req = mockRequest({
			file: {
				buffer: Buffer.from("fake-image-data"),
				originalname: "testfile.jpg",
			} as Express.Multer.File,
			user: { id: "userId" } as UserWithCredentials,
		});
		const res = mockResponse();

		await FileControllers.insertToCache(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.CREATED, expect.anything());
		expect(mockFileStorage.uploadFile).toHaveBeenCalledTimes(1);
	});

	it(`blocks cache insertion at ${CACHE_CAPACITY}-file limit`, async () => {
		mockFileStorage.listFiles.mockResolvedValue(
			new Array(CACHE_CAPACITY).fill("existing-file.jpg"),
		);

		const req = mockRequest({
			file: { buffer: Buffer.from("fake-image-data") } as Express.Multer.File,
			user: { id: "userId" } as UserWithCredentials,
		});
		const res = mockResponse();

		await FileControllers.insertToCache(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST, expect.anything());
	});

	it("returns 400 for missing file upload", async () => {
		const req = mockRequest({
			user: { id: "userId" } as UserWithCredentials,
		});
		const res = mockResponse();

		await FileControllers.insertToCache(req, res, vi.fn());

		expect(respond).toHaveBeenCalledWith(StatusCodes.BAD_REQUEST, expect.anything());
	});

	it("returns 500 for failed cache insertion", async () => {
		mockFileStorage.listFiles.mockResolvedValue([]);
		mockFileStorage.uploadFile.mockRejectedValue(new Error("upload failed"));

		const mockNextFunction = vi.fn();

		const req = mockRequest({
			file: { buffer: Buffer.from("fake-image-data") } as Express.Multer.File,
			user: { id: "userId" } as UserWithCredentials,
		});
		const res = mockResponse();

		await FileControllers.insertToCache(req, res, mockNextFunction);

		expect(mockNextFunction).toHaveBeenCalled();
	});
});
