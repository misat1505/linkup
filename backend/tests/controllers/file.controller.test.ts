import request from "supertest";
import express from "express";
import path from "path";
import fs from "fs";
import { getFile } from "../../src/controllers/file.controller";
import { FileService } from "../../src/services/FileService";
import { VALID_USER_ID } from "../utils/constants";
import { JwtHandler } from "../../src/lib/JwtHandler";

jest.mock("../../src/services/FileService");

(FileService.isUserAvatar as jest.Mock).mockResolvedValue(true);
(FileService.isChatMessage as jest.Mock).mockResolvedValue(true);
(FileService.isChatPhoto as jest.Mock).mockResolvedValue(true);

const app = express();
app.use(express.json());
app.get("/:filename", getFile);

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

const allFiles = [testAvatarPath, testChatPath];

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
};

describe("File Controllers", () => {
  const token = JwtHandler.encode({ userId: VALID_USER_ID });

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
  });
});
