import path from "path";
import fs from "fs";
import request from "supertest";
import app from "../../src/app";
import { JwtHandler } from "../../src/lib/JwtHandler";

const filename = "testfile.txt";
const testFilePath = path.join(__dirname, "..", "..", "static", filename);

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

describe("file router", () => {
  const token = JwtHandler.encode({ userId: 1 });

  beforeEach(() => {
    createTestFile();
  });

  afterEach(() => {
    deleteTestFile();
  });

  describe("/:filename", () => {
    it("should return 404 if the file does not exist", async () => {
      const response = await request(app)
        .get("/files/nonexistentfile.txt")
        .set("Cookie", `token=${token}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "File not found." });
    });

    it("should return the file if it exists", async () => {
      const response = await request(app)
        .get(`/files/${filename}`)
        .set("Cookie", `token=${token}`);
      expect(response.status).toBe(200);
      expect(response.text).toBe("This is a test file");
    });

    it("shouldn't allow request without token", async () => {
      const response = await request(app).get(`/files/${filename}`);
      expect(response.status).toBe(400);
    });
  });
});
