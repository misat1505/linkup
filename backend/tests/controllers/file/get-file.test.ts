import { FileControllers } from "../../../src/controllers";
import { UserWithCredentials } from "../../../src/types/User";
import {
  mockFileService,
  mockFileStorage,
  mockRequest,
  mockResponse,
} from "../../utils/mocks";

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

      expect(res.status).toHaveBeenCalledWith(404);
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.any(String) })
      );
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.any(String) })
      );
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.any(String) })
      );
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.any(String) })
      );
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

      expect(res.status).toHaveBeenCalledWith(404);
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

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ url: expect.any(String) })
      );
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

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
