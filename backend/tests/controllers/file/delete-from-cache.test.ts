import { StatusCodes } from "http-status-codes";
import { FileControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/User";
import {
  mockFileService,
  mockFileStorage,
  mockRequest,
  mockResponse,
} from "@tests/utils/mocks";

describe("deleteFromCache", () => {
  mockFileService.isUserAvatar.mockResolvedValue(true);
  mockFileService.isChatMessage.mockResolvedValue(true);
  mockFileService.isChatPhoto.mockResolvedValue(true);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deletes file from cache successfully", async () => {
    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { params: { filename: "url1" } },
    });
    const res = mockResponse();

    await FileControllers.deleteFromCache(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);

    expect(mockFileStorage.deleteFile).toHaveBeenCalledTimes(1);
    expect(mockFileStorage.deleteFile).toHaveBeenCalledWith(
      `cache/${"userId"}/url1`
    );
  });

  it("returns 500 for failed cache deletion", async () => {
    mockFileStorage.deleteFile.mockRejectedValue(new Error());

    const mockNextFunction = jest.fn();

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: { params: { filename: "testfile.txt" } },
    });
    const res = mockResponse();

    await FileControllers.deleteFromCache(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
