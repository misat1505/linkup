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

describe("getFile", () => {
  mockFileService.isUserAvatar.mockResolvedValue(true);
  mockFileService.isChatMessage.mockResolvedValue(true);
  mockFileService.isChatPhoto.mockResolvedValue(true);

  const mockChatId = "some-chat-id";
  const mockPostId = "post-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("avatar", () => {
    it("returns 404 for non-existent file", async () => {
      mockFileStorage.getSignedUrl.mockRejectedValue(new Error());

      const req = mockRequest({
        user: { id: "userId" } as UserWithCredentials,
        validated: {
          params: { filename: "testfile.txt" },
          query: { filter: "avatar" },
        },
      });
      const res = mockResponse();

      await FileControllers.getFile(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(
        StatusCodes.NOT_FOUND,
        expect.anything(),
      );
    });

    it("returns avatar URL for existing file", async () => {
      mockFileStorage.getSignedUrl.mockResolvedValue("url");

      const req = mockRequest({
        user: { id: "userId" } as UserWithCredentials,
        validated: {
          params: { filename: "testfile.txt" },
          query: { filter: "avatar" },
        },
      });
      const res = mockResponse();

      await FileControllers.getFile(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    });
  });

  describe("chat", () => {
    it("returns chat photo URL for existing file", async () => {
      mockFileStorage.getSignedUrl.mockResolvedValue("url");

      const req = mockRequest({
        user: { id: "userId" } as UserWithCredentials,
        validated: {
          params: { filename: "testfile.txt" },
          query: { filter: "chat-photo", chat: mockChatId },
        },
      });
      const res = mockResponse();

      await FileControllers.getFile(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    });

    it("returns chat message file URL for existing file", async () => {
      mockFileStorage.getSignedUrl.mockResolvedValue("url");

      const req = mockRequest({
        user: { id: "userId" } as UserWithCredentials,
        validated: {
          params: { filename: "testfile.txt" },
          query: { filter: "chat-message", chat: mockChatId },
        },
      });
      const res = mockResponse();

      await FileControllers.getFile(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    });
  });

  describe("cache", () => {
    it("returns cache file URL for existing file", async () => {
      mockFileStorage.getSignedUrl.mockResolvedValue("url");

      const req = mockRequest({
        user: { id: "userId" } as UserWithCredentials,
        validated: {
          params: { filename: "testfile.txt" },
          query: { filter: "cache" },
        },
      });
      const res = mockResponse();

      await FileControllers.getFile(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    });

    it("returns 404 for non-existent cache file", async () => {
      mockFileStorage.getSignedUrl.mockRejectedValue(new Error());

      const req = mockRequest({
        user: { id: "userId" } as UserWithCredentials,
        validated: {
          params: { filename: "testfile.txt" },
          query: { filter: "cache" },
        },
      });
      const res = mockResponse();

      await FileControllers.getFile(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(
        StatusCodes.NOT_FOUND,
        expect.anything(),
      );
    });
  });

  describe("post", () => {
    it("returns post file URL for existing file", async () => {
      mockFileStorage.getSignedUrl.mockResolvedValue("url");

      const req = mockRequest({
        user: { id: "userId" } as UserWithCredentials,
        validated: {
          params: { filename: "testfile.txt" },
          query: { filter: "post", post: mockPostId },
        },
      });
      const res = mockResponse();

      await FileControllers.getFile(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(StatusCodes.OK, expect.anything());
    });

    it("returns 404 for non-existent post file", async () => {
      mockFileStorage.getSignedUrl.mockRejectedValue(new Error());

      const req = mockRequest({
        user: { id: "userId" } as UserWithCredentials,
        validated: {
          params: { filename: "testfile.txt" },
          query: { filter: "post", post: mockPostId },
        },
      });
      const res = mockResponse();

      await FileControllers.getFile(req, res, jest.fn());

      expect(respond).toHaveBeenCalledWith(
        StatusCodes.NOT_FOUND,
        expect.anything(),
      );
    });
  });
});
