import { VALID_USER_ID } from "../utils/constants";
import { getFileController } from "../../src/controllers/file/getFile.controller";
import { getCache } from "../../src/controllers/file/getCache.controller";
import {
  CACHE_CAPACITY,
  insertToCache,
} from "../../src/controllers/file/insertToCache.controller";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { env } from "../../src/config/env";
import { deleteFromCache } from "../../src/controllers/file/deleteFromCache.controller";
import {
  mockFileService,
  mockFileStorage,
  mockRequest,
  mockResponse,
} from "../utils/mocks";

mockFileService.isUserAvatar.mockResolvedValue(true);
mockFileService.isChatMessage.mockResolvedValue(true);
mockFileService.isChatPhoto.mockResolvedValue(true);

const mockChatId = "some-chat-id";

const mockPostId = "post-id";

const token = TokenProcessor.encode(
  { userId: VALID_USER_ID },
  env.ACCESS_TOKEN_SECRET
);

describe("File Controllers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getFile", () => {
    it("shouldn't allow requests without filter", async () => {
      const req = mockRequest({
        params: { filename: "testfile.txt" },
        body: { token: { userId: VALID_USER_ID } },
        query: {},
      });
      const res = mockResponse();

      await getFileController(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    describe("avatar", () => {
      it("should return 404 if the file does not exist", async () => {
        mockFileStorage.getSignedUrl.mockRejectedValue(new Error());

        const req = mockRequest({
          params: { filename: "testfile.txt" },
          body: { token: { userId: VALID_USER_ID } },
          query: { filter: "avatar" },
        });
        const res = mockResponse();

        await getFileController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(404);
      });

      it("should return avatar url if it exists", async () => {
        mockFileStorage.getSignedUrl.mockResolvedValue("url");

        const req = mockRequest({
          params: { filename: "testfile.txt" },
          body: { token: { userId: VALID_USER_ID } },
          query: { filter: "avatar" },
        });
        const res = mockResponse();

        await getFileController(req, res, jest.fn());

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
          params: { filename: "testfile.txt" },
          body: { token: { userId: VALID_USER_ID } },
          query: { filter: "chat-photo", chat: mockChatId },
        });
        const res = mockResponse();

        await getFileController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({ url: expect.any(String) })
        );
      });

      it("should return chat message file url if it exists", async () => {
        mockFileStorage.getSignedUrl.mockResolvedValue("url");

        const req = mockRequest({
          params: { filename: "testfile.txt" },
          body: { token: { userId: VALID_USER_ID } },
          query: { filter: "chat-message", chat: mockChatId },
        });
        const res = mockResponse();

        await getFileController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({ url: expect.any(String) })
        );
      });

      it("should return 400 if filter is chat message, but no chat given", async () => {
        const req = mockRequest({
          params: { filename: "testfile.txt" },
          body: { token: { userId: VALID_USER_ID } },
          query: { filter: "chat-message" },
        });
        const res = mockResponse();

        await getFileController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
      });
    });

    describe("cache", () => {
      it("should return file url from cache if exists", async () => {
        mockFileStorage.getSignedUrl.mockResolvedValue("url");

        const req = mockRequest({
          params: { filename: "testfile.txt" },
          body: { token: { userId: VALID_USER_ID } },
          query: { filter: "cache" },
        });
        const res = mockResponse();

        await getFileController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({ url: expect.any(String) })
        );
      });

      it("should return 404 if file from cache doesn't exist", async () => {
        mockFileStorage.getSignedUrl.mockRejectedValue(new Error());

        const req = mockRequest({
          params: { filename: "testfile.txt" },
          body: { token: { userId: VALID_USER_ID } },
          query: { filter: "cache" },
        });
        const res = mockResponse();

        await getFileController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(404);
      });
    });

    describe("post", () => {
      it("should return file url from post if exists", async () => {
        mockFileStorage.getSignedUrl.mockResolvedValue("url");

        const req = mockRequest({
          params: { filename: "testfile.txt" },
          body: { token: { userId: VALID_USER_ID } },
          query: { filter: "post", post: mockPostId },
        });
        const res = mockResponse();

        await getFileController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining({ url: expect.any(String) })
        );
      });

      it("should return 404 if file from post doesn't exist", async () => {
        mockFileStorage.getSignedUrl.mockRejectedValue(new Error());

        const req = mockRequest({
          params: { filename: "testfile.txt" },
          body: { token: { userId: VALID_USER_ID } },
          query: { filter: "post", post: mockPostId },
        });
        const res = mockResponse();

        await getFileController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(404);
      });

      it("shouldn't return 400 if filter is post but no post id given", async () => {
        const req = mockRequest({
          params: { filename: "testfile.txt" },
          body: { token: { userId: VALID_USER_ID } },
          query: { filter: "post" },
        });
        const res = mockResponse();

        await getFileController(req, res, jest.fn());

        expect(res.status).toHaveBeenCalledWith(400);
      });
    });
  });

  describe("getCache", () => {
    it("returns user's cache", async () => {
      mockFileStorage.listFiles.mockResolvedValue(["url", "url2"]);

      const req = mockRequest({
        params: { filename: "testfile.txt" },
        body: { token: { userId: VALID_USER_ID } },
        query: { filter: "post" },
      });
      const res = mockResponse();

      await getCache(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);

      expect(mockFileStorage.listFiles).toHaveBeenCalledTimes(1);
      expect(mockFileStorage.listFiles).toHaveBeenCalledWith(
        `cache/${VALID_USER_ID}`
      );
    });
  });

  describe("insertToCache", () => {
    it("inserts file to cache and returns newly created filename", async () => {
      mockFileStorage.listFiles.mockResolvedValue([]);
      mockFileStorage.uploadFile.mockResolvedValue("new-file.jpg");

      const req = mockRequest({
        file: {
          buffer: Buffer.from("fake-image-data"),
          originalname: "testfile.jpg",
        } as Express.Multer.File,
        body: { token: { userId: VALID_USER_ID } },
      });
      const res = mockResponse();

      await insertToCache(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ file: expect.any(String) })
      );
      expect(mockFileStorage.uploadFile).toHaveBeenCalledTimes(1);
    });

    it(`does not allow inserting if user has already ${CACHE_CAPACITY} files`, async () => {
      mockFileStorage.listFiles.mockResolvedValue(
        new Array(CACHE_CAPACITY).fill("existing-file.jpg")
      );

      const req = mockRequest({
        file: { buffer: Buffer.from("fake-image-data") } as Express.Multer.File,
        body: { token: { userId: VALID_USER_ID } },
      });
      const res = mockResponse();

      await insertToCache(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it("returns 400 if no file uploaded", async () => {
      const req = mockRequest({
        body: { token: { userId: VALID_USER_ID } },
      });
      const res = mockResponse();

      await insertToCache(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("returns 500 if upload fails", async () => {
      mockFileStorage.listFiles.mockResolvedValue([]);
      mockFileStorage.uploadFile.mockRejectedValue(new Error("upload failed"));

      const mockNextFunction = jest.fn();

      const req = mockRequest({
        file: { buffer: Buffer.from("fake-image-data") } as Express.Multer.File,
        body: { token: { userId: VALID_USER_ID } },
      });
      const res = mockResponse();

      await insertToCache(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });
  });

  describe("deleteFromCache", () => {
    it("deletes file from cache", async () => {
      const req = mockRequest({
        params: { filename: "url1" },
        body: { token: { userId: VALID_USER_ID } },
      });
      const res = mockResponse();

      await deleteFromCache(req, res, jest.fn());

      expect(res.status).toHaveBeenCalledWith(200);

      expect(mockFileStorage.deleteFile).toHaveBeenCalledTimes(1);
      expect(mockFileStorage.deleteFile).toHaveBeenCalledWith(
        `cache/${VALID_USER_ID}/url1`
      );
    });

    it("returns 500 if file cannot be deleted", async () => {
      mockFileStorage.deleteFile.mockRejectedValue(new Error());

      const mockNextFunction = jest.fn();

      const req = mockRequest({
        params: { filename: "testfile.txt" },
        body: { token: { userId: VALID_USER_ID } },
      });
      const res = mockResponse();

      await getFileController(req, res, mockNextFunction);

      expect(mockNextFunction).toHaveBeenCalled();
    });
  });
});
