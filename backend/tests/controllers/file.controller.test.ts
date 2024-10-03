import request from "supertest";
import express from "express";
import path from "path";
import fs from "fs";
import { FileService } from "../../src/services/FileService";
import { USER, VALID_USER_ID } from "../utils/constants";
import { getFileController } from "../../src/controllers/file/getFile.controller";

jest.mock("../../src/services/FileService");

(FileService.isUserAvatar as jest.Mock).mockResolvedValue(true);
(FileService.isChatMessage as jest.Mock).mockResolvedValue(true);
(FileService.isChatPhoto as jest.Mock).mockResolvedValue(true);

const app = express();
app.use(express.json());
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

  fs.rmdirSync(path.dirname(testChatPath), { recursive: true });
  fs.rmdirSync(path.dirname(testCachePath), { recursive: true });
  fs.rmdirSync(path.dirname(testPostPath), { recursive: true });
};

describe("File Controllers", () => {
  describe("getFile", () => {
    beforeAll(() => {
      createTestFile();
    });

    afterAll(() => {
      deleteTestFile();
    });

    it("shouldn't allow requests without filter", async () => {
      const response = await request(app)
        .get("/nonexistentfile.txt")
        .send({ token: { userId: VALID_USER_ID } });
      expect(response.status).toBe(400);
    });

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
