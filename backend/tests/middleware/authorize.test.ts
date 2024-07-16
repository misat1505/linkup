import express from "express";
import request from "supertest";
import { authorize } from "../../src/middlewares/authorize";
import { JwtHandler } from "../../src/lib/JwtHandler";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";

describe("authorize middleware", () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.post("/test", authorize, (req, res) => {
    res.status(200).json({ userId: req.body.token.userId });
  });

  it("should append token on authorized", async () => {
    const userId = uuidv4();
    const token = JwtHandler.encode({ userId });
    const response = await request(app)
      .post("/test")
      .set("Cookie", `token=${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(userId);
  });

  it("shouldn't allow no token", async () => {
    const response = await request(app).post("/test");
    expect(response.statusCode).toBe(400);
  });

  it("shouldn't allow invalid token", async () => {
    const response = await request(app)
      .post("/test")
      .set("Cookie", "token=invalid");
    expect(response.statusCode).toBe(401);
  });
});
