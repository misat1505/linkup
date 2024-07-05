import express from "express";
import path from "path";
import fs from "fs";
import request from "supertest";
import { upload } from "../../src/middlewares/multer";

describe("multer", () => {
  const app = express();
  app.use(express.json());
  app.post("/test", upload.single("file"), (req, res) => {
    res.status(200).send({ path: req.file?.path });
  });

  const testFilePath = path.join("test-file.txt");
  let uploadedFilePath = "";

  beforeAll(() => {
    fs.writeFileSync(testFilePath, "This is a test file");
  });

  afterAll(() => {
    fs.unlinkSync(testFilePath);
    fs.unlinkSync(uploadedFilePath);
  });

  it("should save uploaded file", async () => {
    const response = await request(app)
      .post("/test")
      .attach("file", testFilePath);

    expect(response.statusCode).toBe(200);
    const { path } = response.body;
    expect(fs.existsSync(path)).toBe(true);
    uploadedFilePath = path;
  });
});
