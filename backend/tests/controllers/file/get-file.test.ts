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
    it("should return 404 if the file does not exist", async () => {
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

    it("should return avatar url if it exists", async () => {
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
    it("should return chat photo url if it exists", async () => {
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

    it("should return chat message file url if it exists", async () => {
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
    it("should return file url from cache if exists", async () => {
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

    it("should return 404 if file from cache doesn't exist", async () => {
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
    it("should return file url from post if exists", async () => {
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

    it("should return 404 if file from post doesn't exist", async () => {
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
