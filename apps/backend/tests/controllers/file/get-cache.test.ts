import { FileControllers } from "@/controllers";
import { UserWithCredentials } from "@/types/UserWithCredentials";
import {
  mockFileService,
  mockFileStorage,
  mockRequest,
  mockResponse,
} from "@tests/utils/mocks";
import { StatusCodes } from "http-status-codes";

const respond = jest.fn();
jest.mock("@/utils/validatedResponder", () => ({
  buildValidatedResponder: jest.fn(() => respond),
}));

describe("getCache", () => {
  mockFileService.isUserAvatar.mockResolvedValue(true);
  mockFileService.isChatMessage.mockResolvedValue(true);
  mockFileService.isChatPhoto.mockResolvedValue(true);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("retrieves user's cache files", async () => {
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

    expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());

    expect(mockFileStorage.listFiles).toHaveBeenCalledTimes(1);
    expect(mockFileStorage.listFiles).toHaveBeenCalledWith(`cache/${"userId"}`);
  });
});
