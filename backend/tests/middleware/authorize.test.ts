import express from "express";
import request from "supertest";
import { authorize } from "../../src/middlewares/authorize";
import { TokenProcessor } from "../../src/lib/TokenProcessor";
import cookieParser from "cookie-parser";
import { env } from "../../src/config/env";
import { UserService } from "../../src/services/UserService";
import { USER } from "../utils/constants";

jest.mock("../../src/services/UserService");

describe("authorize middleware", () => {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.post("/test", authorize, (req, res) => {
    res.status(200).json({ userId: req.body.token.userId });
  });

  it("should append token on authorized", async () => {
    (UserService.getUser as jest.Mock).mockResolvedValue(USER);
    const token = TokenProcessor.encode(
      { userId: USER.id },
      env.ACCESS_TOKEN_SECRET
    );
    const response = await request(app)
      .post("/test")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe(USER.id);
  });

  it("shouldn't allow valid token of non-existent user", async () => {
    (UserService.getUser as jest.Mock).mockResolvedValue(null);
    const token = TokenProcessor.encode(
      { userId: USER.id },
      env.ACCESS_TOKEN_SECRET
    );
    const response = await request(app)
      .post("/test")
      .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
  });

  it("shouldn't allow no token", async () => {
    (UserService.getUser as jest.Mock).mockResolvedValue(USER);
    const response = await request(app).post("/test");
    expect(response.statusCode).toBe(400);
  });

  it("shouldn't allow invalid token", async () => {
    (UserService.getUser as jest.Mock).mockResolvedValue(USER);
    const response = await request(app)
      .post("/test")
      .set("Authorization", `Bearer invalid`);
    expect(response.statusCode).toBe(401);
  });
});
