import { FileControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import {
  mockFileService,
  mockFileStorage,
  mockRequest,
  mockResponse,
} from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";
import { afterEach, describe, expect, it, vi } from "vitest";

const respond = vi.fn();
vi.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: vi.fn(() => respond),
}));

describe("deleteFromCache", () => {
  mockFileService.isUserAvatar.mockResolvedValue(true);
  mockFileService.isChatMessage.mockResolvedValue(true);
  mockFileService.isChatPhoto.mockResolvedValue(true);

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("deletes file from cache successfully", async () => {
    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { params: { filename: "url1" } },
    });
    const res = mockResponse();

    await FileControllers.deleteFromCache(req, res, vi.fn());

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());

    expect(mockFileStorage.deleteFile).toHaveBeenCalledTimes(1);
    expect(mockFileStorage.deleteFile).toHaveBeenCalledWith(
      `cache/${"userId"}/url1`,
    );
  });

  it("returns 500 for failed cache deletion", async () => {
    mockFileStorage.deleteFile.mockRejectedValue(new Error());

    const mockNextFunction = vi.fn();

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { params: { filename: "testfile.txt" } },
    });
    const res = mockResponse();

    await FileControllers.deleteFromCache(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
