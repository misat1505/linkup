import request from "supertest";
import express from "express";
import path from "path";
import { FileService } from "../../src/services/FileService";
import { USER, VALID_USER_ID } from "../utils/constants";
import { getFileController } from "../../src/controllers/file/getFile.controller";
import { getCache } from "../../src/controllers/file/getCache.controller";
import { upload } from "../../src/middlewares/multer";
import {
  CACHE_CAPACITY,
  insertToCache,
} from "../../src/controllers/file/insertToCache.controller";
import { authorize } from "../../src/middlewares/authorize";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import { env } from "../../src/config/env";
import { deleteFromCache } from "../../src/controllers/file/deleteFromCache.controller";
import fileStorage from "../../src/lib/FileStorage";

jest.mock("../../src/services/FileService");
jest.mock("../../src/lib/FileStorage");

(FileService.isUserAvatar as jest.Mock).mockResolvedValue(true);
(FileService.isChatMessage as jest.Mock).mockResolvedValue(true);
(FileService.isChatPhoto as jest.Mock).mockResolvedValue(true);

const app = express();
app.use(express.json());
app.post("/cache", upload.single("file"), authorize, insertToCache);
app.get("/cache", getCache);
app.delete("/cache/:filename", deleteFromCache);
app.get("/:filename", getFileController);

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
      const response = await request(app)
        .get("/nonexistentfile.txt")
        .send({ token: { userId: VALID_USER_ID } });
      expect(response.status).toBe(400);
    });

    describe("avatar", () => {
      it("should return 404 if the file does not exist", async () => {
        (fileStorage.getSignedUrl as jest.Mock).mockRejectedValue(new Error());

        const response = await request(app)
          .get("/nonexistentfile.txt?filter=avatar")
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "File not found." });
      });

      it("should return avatar url if it exists", async () => {
        (fileStorage.getSignedUrl as jest.Mock).mockResolvedValue("url");

        const response = await request(app)
          .get("/testfile.txt?filter=avatar")
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ url: "url" });
      });
    });

    describe("chat", () => {
      it("should return chat photo url if it exists", async () => {
        (fileStorage.getSignedUrl as jest.Mock).mockResolvedValue("url");

        const response = await request(app)
          .get(`/testfile.txt?filter=chat-photo&chat=${mockChatId}`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ url: "url" });
      });

      it("should return chat message file url if it exists", async () => {
        (fileStorage.getSignedUrl as jest.Mock).mockResolvedValue("url");

        const response = await request(app)
          .get(`/testfile.txt?filter=chat-message&chat=${mockChatId}`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ url: "url" });
      });

      it("should return 400 if filter is chat message, but no chat given", async () => {
        const response = await request(app)
          .get(`/testfile.txt?filter=chat-message`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(400);
      });
    });

    describe("cache", () => {
      it("should return file url from cache if exists", async () => {
        (fileStorage.getSignedUrl as jest.Mock).mockResolvedValue("url");

        const response = await request(app)
          .get(`/testfile.txt?filter=cache`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ url: "url" });
      });

      it("should return 404 if file from cache doesn't exist", async () => {
        (fileStorage.getSignedUrl as jest.Mock).mockRejectedValue(new Error());

        const response = await request(app)
          .get(`/non-existent.txt?filter=cache`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(404);
      });
    });

    describe("post", () => {
      it("should return file url from post if exists", async () => {
        (fileStorage.getSignedUrl as jest.Mock).mockResolvedValue("url");

        const response = await request(app)
          .get(`/testfile.txt?filter=post&post=${mockPostId}`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ url: "url" });
      });

      it("should return 404 if file from post doesn't exist", async () => {
        (fileStorage.getSignedUrl as jest.Mock).mockRejectedValue(new Error());

        const response = await request(app)
          .get(`/non-existent.txt?filter=post&post=${mockPostId}`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(404);
      });

      it("shouldn't return 400 if filter is post but no post id given", async () => {
        const response = await request(app)
          .get(`/testfile.txt?filter=post`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(400);
      });
    });
  });

  describe("getCache", () => {
    it("returns user's cache", async () => {
      (fileStorage.listFiles as jest.Mock).mockResolvedValue(["url", "url2"]);

      const response = await request(app)
        .get(`/cache`)
        .send({ token: { userId: VALID_USER_ID } });
      expect(response.status).toBe(200);
      const filenames = response.body.files;
      expect(filenames).toEqual(["url", "url2"]);

      expect(fileStorage.listFiles).toHaveBeenCalledTimes(1);
      expect(fileStorage.listFiles).toHaveBeenCalledWith(
        `cache/${VALID_USER_ID}`
      );
    });
  });

  describe("insertToCache", () => {
    it("inserts file to cache and returns newly created filename", async () => {
      (fileStorage.listFiles as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .post(`/cache`)
        .set("Authorization", `Bearer ${token}`)
        .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));
      expect(response.status).toBe(201);

      expect(fileStorage.uploadFile).toHaveBeenCalledTimes(1);
    });

    it(`cache can store up to ${CACHE_CAPACITY} files per user`, async () => {
      (fileStorage.listFiles as jest.Mock).mockResolvedValue(
        new Array(CACHE_CAPACITY).fill("url1")
      );

      const response = await request(app)
        .post(`/cache`)
        .set("Authorization", `Bearer ${token}`)
        .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

      expect(response.statusCode).not.toBe(201);
    });
  });

  describe("deleteFromCache", () => {
    it("deletes file from cache", async () => {
      const res2 = await request(app)
        .delete(`/cache/url1`)
        .send({ token: { userId: VALID_USER_ID } });
      expect(res2.statusCode).toBe(200);

      expect(fileStorage.deleteFile).toHaveBeenCalledTimes(1);
      expect(fileStorage.deleteFile).toHaveBeenCalledWith(
        `cache/${VALID_USER_ID}/url1`
      );
    });

    it("returns 500 if file cannot be deleted", async () => {
      (fileStorage.deleteFile as jest.Mock).mockRejectedValue(new Error());

      const response = await request(app)
        .delete(`/cache/not-found.tsx`)
        .send({ token: { userId: VALID_USER_ID } });

      expect(response.statusCode).toBe(500);
    });
  });
});
