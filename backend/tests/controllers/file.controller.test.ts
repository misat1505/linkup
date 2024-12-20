import request from "supertest";
import express from "express";
import path from "path";
import fs from "fs";
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

jest.mock("../../src/services/FileService");

(FileService.isUserAvatar as jest.Mock).mockResolvedValue(true);
(FileService.isChatMessage as jest.Mock).mockResolvedValue(true);
(FileService.isChatPhoto as jest.Mock).mockResolvedValue(true);

const app = express();
app.use(express.json());
app.post("/cache", upload.single("file"), authorize, insertToCache);
app.get("/cache", getCache);
app.delete("/cache/:filename", deleteFromCache);
app.get("/:filename", getFileController);

const testAvatarPath = path.join(
  __dirname,
  "..",
  "..",
  "files",
  "avatars",
  "testfile.txt"
);

const mockChatId = "some-chat-id";

const testChatPath = path.join(
  __dirname,
  "..",
  "..",
  "files",
  "chats",
  mockChatId,
  "testfile.txt"
);

const testCachePath = path.join(
  __dirname,
  "..",
  "..",
  "files",
  "cache",
  VALID_USER_ID,
  "testfile.txt"
);

const mockPostId = "post-id";

const testPostPath = path.join(
  __dirname,
  "..",
  "..",
  "files",
  "posts",
  mockPostId,
  "testfile.txt"
);

const allFiles = [testAvatarPath, testChatPath, testCachePath, testPostPath];

const createTestFile = () => {
  allFiles.forEach((file) => {
    if (!fs.existsSync(path.dirname(file))) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
    }
    fs.writeFileSync(file, "This is a test file");
  });
};

const deleteTestFile = () => {
  allFiles.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });

  if (fs.existsSync(path.dirname(testChatPath)))
    fs.rmdirSync(path.dirname(testChatPath), { recursive: true });
  if (fs.existsSync(path.dirname(testCachePath)))
    fs.rmdirSync(path.dirname(testCachePath), { recursive: true });
  if (fs.existsSync(path.dirname(testPostPath)))
    fs.rmdirSync(path.dirname(testPostPath), { recursive: true });
};

const token = TokenProcessor.encode(
  { userId: VALID_USER_ID },
  env.ACCESS_TOKEN_SECRET
);

describe("File Controllers", () => {
  beforeAll(() => {
    createTestFile();
  });

  afterAll(() => {
    deleteTestFile();
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
        const response = await request(app)
          .get("/nonexistentfile.txt?filter=avatar")
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "File not found." });
      });

      it("should return avatar file if it exists", async () => {
        const response = await request(app)
          .get("/testfile.txt?filter=avatar")
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(200);
        expect(response.text).toBe("This is a test file");
      });
    });

    describe("chat", () => {
      it("should return chat photo if it exists", async () => {
        const response = await request(app)
          .get(`/testfile.txt?filter=chat-photo&chat=${mockChatId}`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(200);
        expect(response.text).toBe("This is a test file");
      });

      it("should return chat message file if it exists", async () => {
        const response = await request(app)
          .get(`/testfile.txt?filter=chat-message&chat=${mockChatId}`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(200);
        expect(response.text).toBe("This is a test file");
      });

      it("should return 400 if filter is chat message, but no chat given", async () => {
        const response = await request(app)
          .get(`/testfile.txt?filter=chat-message`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(400);
      });
    });

    describe("cache", () => {
      it("should return file from cache if exists", async () => {
        const response = await request(app)
          .get(`/testfile.txt?filter=cache`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(200);
        expect(response.text).toBe("This is a test file");
      });

      it("should return 404 if file from cache doesn't exist", async () => {
        const response = await request(app)
          .get(`/non-existent.txt?filter=cache`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(404);
      });

      it("shouldn't return file belonging to other user", async () => {
        const response = await request(app)
          .get(`/testfile.txt?filter=cache`)
          .send({ token: { userId: "not-existent" } });
        expect(response.status).toBe(404);
      });
    });

    describe("post", () => {
      it("should return file from post if exists", async () => {
        const response = await request(app)
          .get(`/testfile.txt?filter=post&post=${mockPostId}`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(200);
        expect(response.text).toBe("This is a test file");
      });

      it("should return 404 if file from post doesn't exist", async () => {
        const response = await request(app)
          .get(`/non-existent.txt?filter=post&post=${mockPostId}`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(response.status).toBe(404);
      });

      it("shouldn't return file belonging to other post", async () => {
        const response = await request(app)
          .get(`/testfile.txt?filter=post&post=other`)
          .send({ token: { userId: "not-existent" } });
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
      const response = await request(app)
        .get(`/cache`)
        .send({ token: { userId: VALID_USER_ID } });
      expect(response.status).toBe(200);
      const filenames = response.body.files;
      expect(Array.isArray(filenames)).toBe(true);

      filenames.forEach(async (filename: unknown) => {
        expect(typeof filename).toBe("string");
        const res2 = await request(app)
          .get(`/${filename}?filter=cache`)
          .send({ token: { userId: VALID_USER_ID } });
        expect(res2.statusCode).toBe(200);
      });
    });
  });

  describe("insertToCache", () => {
    it("inserts file to cache and returns newly created filename", async () => {
      const response = await request(app)
        .post(`/cache`)
        .set("Authorization", `Bearer ${token}`)
        .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));
      expect(response.status).toBe(201);
      const file = response.body.file;

      expect(typeof file).toBe("string");
      const res2 = await request(app)
        .get(`/${file}?filter=cache`)
        .send({ token: { userId: VALID_USER_ID } });
      expect(res2.statusCode).toBe(200);
    });

    it(`cache can store up to ${CACHE_CAPACITY} files per user`, async () => {
      deleteTestFile();

      for (let i = 0; i < CACHE_CAPACITY; i++) {
        const response = await request(app)
          .post(`/cache`)
          .set("Authorization", `Bearer ${token}`)
          .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

        expect(response.statusCode).toBe(201);
      }

      const response = await request(app)
        .post(`/cache`)
        .set("Authorization", `Bearer ${token}`)
        .attach("file", path.join(__dirname, "..", "utils", "image.jpg"));

      expect(response.statusCode).not.toBe(201);
    });
  });

  describe("deleteFromCache", () => {
    it("deletes file from cache", async () => {
      const response = await request(app)
        .get(`/cache`)
        .send({ token: { userId: VALID_USER_ID } });

      const initialFileNumber = response.body.files.length;

      const res2 = await request(app)
        .delete(`/cache/${response.body.files[0]}`)
        .send({ token: { userId: VALID_USER_ID } });
      expect(res2.statusCode).toBe(200);

      const res3 = await request(app)
        .get(`/cache`)
        .send({ token: { userId: VALID_USER_ID } });

      const fileNumberAfterDelete = res3.body.files.length;
      expect(fileNumberAfterDelete).toBe(initialFileNumber - 1);
    });

    it("returns 404 if file not found", async () => {
      const response = await request(app)
        .delete(`/cache/not-found.tsx`)
        .send({ token: { userId: VALID_USER_ID } });

      expect(response.statusCode).toBe(404);
    });
  });
});
