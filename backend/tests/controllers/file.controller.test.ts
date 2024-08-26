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

const testFilePath = path.join(__dirname, "..", "..", "static", "testfile.txt");

const createTestFile = () => {
  if (!fs.existsSync(path.dirname(testFilePath))) {
    fs.mkdirSync(path.dirname(testFilePath), { recursive: true });
  }
  fs.writeFileSync(testFilePath, "This is a test file");
};

const deleteTestFile = () => {
  if (fs.existsSync(testFilePath)) {
    fs.unlinkSync(testFilePath);
  }
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
        .get("/testfile.txt?filter=chat-photo")
        .send({ token: { userId: VALID_USER_ID } });
      expect(response.status).toBe(200);
      expect(response.text).toBe("This is a test file");
    });

    it("should return chat message file if it exists", async () => {
      const response = await request(app)
        .get("/testfile.txt?filter=chat-message")
        .send({ token: { userId: VALID_USER_ID } });
      expect(response.status).toBe(200);
      expect(response.text).toBe("This is a test file");
    });
  });
});
