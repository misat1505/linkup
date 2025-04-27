import { FileControllers } from "../../../src/controllers";
import {
  mockFileService,
  mockFileStorage,
  mockRequest,
  mockResponse,
} from "../../utils/mocks";

describe("deleteFromCache", () => {
  mockFileService.isUserAvatar.mockResolvedValue(true);
  mockFileService.isChatMessage.mockResolvedValue(true);
  mockFileService.isChatPhoto.mockResolvedValue(true);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deletes file from cache", async () => {
    const req = mockRequest({
      params: { filename: "url1" },
      body: { token: { userId: "userId" } },
    });
    const res = mockResponse();

    await FileControllers.deleteFromCache(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);

    expect(mockFileStorage.deleteFile).toHaveBeenCalledTimes(1);
    expect(mockFileStorage.deleteFile).toHaveBeenCalledWith(
      `cache/${"userId"}/url1`
    );
  });

  it("returns 500 if file cannot be deleted", async () => {
    mockFileStorage.deleteFile.mockRejectedValue(new Error());

    const mockNextFunction = jest.fn();

    const req = mockRequest({
      params: { filename: "testfile.txt" },
      body: { token: { userId: "userId" } },
    });
    const res = mockResponse();

    await FileControllers.deleteFromCache(req, res, mockNextFunction);

    expect(mockNextFunction).toHaveBeenCalled();
  });
});
