import { FileControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import {
  mockFileService,
  mockFileStorage,
  mockRequest,
  mockResponse,
} from "../../utils/mocks";

describe("getCache", () => {
  mockFileService.isUserAvatar.mockResolvedValue(true);
  mockFileService.isChatMessage.mockResolvedValue(true);
  mockFileService.isChatPhoto.mockResolvedValue(true);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retrieves user’s cache files", async () => {
    mockFileStorage.listFiles.mockResolvedValue(["url", "url2"]);

    const req = mockRequest({
      user: { id: "userId" } as UserWithCredentials,
      validated: {
        params: { filename: "testfile.txt" },
        query: { filter: "post" },
      },
    });
    const res = mockResponse();

    await FileControllers.getCache(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(200);

    expect(mockFileStorage.listFiles).toHaveBeenCalledTimes(1);
    expect(mockFileStorage.listFiles).toHaveBeenCalledWith(`cache/${"userId"}`);
  });
});
