import express from "express";
import request from "supertest";
import { authorize } from "../../src/middlewares/authorize";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import { env } from "../../src/config/env";

describe("authorize middleware", () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.post("/test", authorize, (req, res) => {
    res.status(200).json({ userId: req.body.token.userId });
  });

  it("should append token on authorized", async () => {
    const userId = uuidv4();
    const token = TokenProcessor.encode({ userId }, env.ACCESS_TOKEN_SECRET);
    const response = await request(app)
      .post("/test")
      .set("Authorization", `Bearer ${token}`);

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
      .set("Authorization", `Bearer invalid`);
    expect(response.statusCode).toBe(401);
  });
});
