import request from "supertest";
import express from "express";
import path from "path";
import fs from "fs";
import { getFile } from "../../src/controllers/file.controller";

const app = express();
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
  describe("getFile", () => {
    beforeAll(() => {
      createTestFile();
    });

    afterAll(() => {
      deleteTestFile();
    });

    it("should return 404 if the file does not exist", async () => {
      const response = await request(app).get("/nonexistentfile.txt");
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "File not found." });
    });

    it("should return the file if it exists", async () => {
      const response = await request(app).get("/testfile.txt");
      expect(response.status).toBe(200);
      expect(response.text).toBe("This is a test file");
    });
  });
});
